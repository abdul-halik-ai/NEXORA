import { NextResponse } from 'next/server'
import * as services from '@/lib/services'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const categorySlug = searchParams.get('category') || undefined
  const difficulty = (searchParams.get('difficulty') as any) || undefined
  const search = searchParams.get('search') || undefined
  const technology = searchParams.get('technology') || undefined
  const sort = (searchParams.get('sort') as any) || undefined

  try {
    const projects = await services.getProjects({
      categorySlug,
      difficulty,
      search,
      technology,
      sort,
    })
    return NextResponse.json({ projects })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
