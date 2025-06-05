import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import connectionDb from '@/lib/db/ConnectionDb'
import { User } from '@/lib/models/User' // pastikan path model user sesuai

export async function POST(request: Request) {
  try {
    await connectionDb()
    const { email, password } = await request.json()

    // 1. Cari user berdasarkan email
    const user = await User.findOne({ email })
    if (!user) {
      return NextResponse.json({ message: 'User tidak ditemukan' }, { status: 404 })
    }

    // 2. Cocokkan password
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return NextResponse.json({ message: 'Password salah' }, { status: 401 })
    }

    // 3. Buat JWT Token dengan masa berlaku 30 hari
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '30d' }
    )

    // 4. Kirim token via cookie
    const response = NextResponse.json({ message: 'Login berhasil' }, { status: 200 })

    const oneMonth = 30 * 24 * 60 * 60 // 30 hari dalam detik
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: oneMonth,
      path: '/'
    })

    return response

  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}
