import { NextRequest, NextResponse } from 'next/server'
import { revalidateTag } from 'next/cache'
import type { AssetType } from '@/types/commonTypes.types'
import { transactionListTag } from '@/lib/tags/tags'

export async function POST(req: NextRequest) {
    const { assetType }: { assetType: AssetType } = await req.json()

    if (!assetType) {
        return NextResponse.json({ error: 'assetType is required' }, { status: 400 })
    }

    revalidateTag(transactionListTag(assetType))

    return NextResponse.json({ revalidated: true })
}
