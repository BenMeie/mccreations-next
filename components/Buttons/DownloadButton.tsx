'use client'
import { downloadMap } from "@/app/api/content"
import MainButton from "./MainButton"
import { ContentTypes, IFile } from "@/app/api/types";

export default function DownloadButton({slug, file, types}: {slug: string, file: IFile, types: ContentTypes[]}) {
    const downloadButtonClicked = async () => {
        await downloadMap(slug)
        if(types.includes(ContentTypes.Maps) && file.worldUrl) {
            let a = document.createElement('a')
            a.href = file.worldUrl
            a.download = slug
            a.target = '_blank'
            a.click()
            a.remove()
        }
        if(types.includes(ContentTypes.Resourcepacks) && file.resourceUrl) {
            let a = document.createElement('a')
            a.href = file.resourceUrl
            a.download = slug
            a.target = '_blank'
            a.click()
            a.remove()
        }
        if(types.includes(ContentTypes.Datapacks) && file.dataUrl) {
            let a = document.createElement('a')
            a.href = file.dataUrl
            a.download = slug
            a.target = '_blank'
            a.click()
            a.remove()
        }
    }

    return (
        <MainButton onClick={downloadButtonClicked}>Download</MainButton>
    )
}