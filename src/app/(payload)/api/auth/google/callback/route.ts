import { google } from 'googleapis'
import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'
import crypto from 'crypto'

export async function GET(req: Request) {
  const payload = await getPayload({ config })

  const { searchParams } = new URL(req.url)
  const code = searchParams.get('code')

  if (!code) {
    return NextResponse.redirect(new URL('/admin/auth/login', req.url))
  }

  const client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  )

  const { tokens } = await client.getToken(code)

  const ticket = await client.verifyIdToken({
    idToken: tokens.id_token!,
    audience: process.env.GOOGLE_CLIENT_ID,
  })

  const profile = ticket.getPayload()

  if (!profile?.email) {
    return NextResponse.redirect(new URL('/admin/auth/login', req.url))
  }

  const existing = await payload.find({
    collection: 'users',
    where: {
      email: { equals: profile.email },
    },
  })

  if (existing.docs.length === 0) {
    return NextResponse.redirect(
      new URL('/admin/auth/login?error=unauthorized', req.url)
    )
  }

  const password = crypto.randomBytes(32).toString('hex')

  await payload.update({
    collection: 'users',
    id: existing.docs[0].id,
    data: { password },
  })

  const origin = new URL(req.url).origin

  const loginRes = await fetch(`${origin}/api/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({
      email: profile.email,
      password,
    }),
  })

  if (!loginRes.ok) {
    throw new Error('Payload login failed')
  }

  const response = NextResponse.redirect(new URL('/admin', req.url))

  const setCookie = loginRes.headers.get('set-cookie')
  if (setCookie) {
    response.headers.set('set-cookie', setCookie)
  }

  return response
}
