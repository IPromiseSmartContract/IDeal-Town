import JSZip from 'jszip'

export interface FileObject {
    filename: string
    text: string
}

export async function zipTextAndFiles(text: string, files: FileObject[]): Promise<Blob> {
    const zip = new JSZip()
    zip.file('README.md', text)
    files.forEach(({ filename, text }) => {
        zip.file(filename, text)
    })
    const content = await zip.generateAsync({ type: 'blob' })
    return content
}
export async function unzipFiles(zipFile: Blob): Promise<FileObject[]> {
    const zip = new JSZip()
    const fileObjects: FileObject[] = []

    const zipFileData = await zip.loadAsync(zipFile)

    for (const filename in zipFileData.files) {
        const fileData = zipFileData.files[filename]
        const text = await fileData.async('text')
        const fileObject: FileObject = {
            filename,
            text
        }

        fileObjects.push(fileObject)
    }
    console.log('=====================')
    console.log(fileObjects)

    return fileObjects
}
