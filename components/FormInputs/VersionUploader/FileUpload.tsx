'use client'

import { FilePreview, IFile, MinecraftVersion } from '@/app/types'
import Image from 'next/image'
import { useCallback, useEffect, useState } from 'react'
import { FileRejection, useDropzone } from 'react-dropzone'
import { Plus, UploadCloud, X } from 'react-feather'
import styles from './FileDropzone.module.css'
import upload from '@/app/api/upload'
import FormComponent from '../../Form/Form'
import { PopupMessage, PopupMessageType } from '../../PopupMessage/PopupMessage'

const FileDropzone = ({ onFilesUploaded, presetFile }: { presetImage?: string, onFilesUploaded(files: string) : void, presetFile?: string }) => {
    const [file, setFile] = useState<string>("")
    const [rejected, setRejected] = useState<FileRejection[]>([])

    const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
        if (acceptedFiles?.length) {
            console.log("Got a valid file")
            acceptedFiles.forEach(file => {
                upload(file).then(url => {
                    if(url) {
                        // PopupMessage.addMessage(new PopupMessage(PopupMessageType.Alert, `Uploaded ${file.name}`))
                        setFile(url)
                    } else {
                        PopupMessage.addMessage(new PopupMessage(PopupMessageType.Error, `Uploading ${file.name} failed`))
                    }
                });
            })
        }

        if (rejectedFiles?.length) {
            setRejected(previousFiles => [...previousFiles, ...rejectedFiles])
            rejectedFiles.forEach(file => {
                PopupMessage.addMessage(new PopupMessage(PopupMessageType.Error, `${file.file.name} is not a valid file`))
            })
        }
    }, [])

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        accept: {
            'application/zip': ['.zip']
        },
        onDrop
    })

    useEffect(() => {
        if(presetFile) {
            setFile(presetFile);
        }
    }, [])

    useEffect(() => {
        onFilesUploaded(file)
    }, [file])

    const removeFile = (name: string) => {
        setFile("")
    }

    const removeAll = () => {
        setFile("")
        setRejected([])
    }

    const removeRejected = (name: string) => {
        setRejected(files => files.filter(({ file }) => file.name !== name))
    }

    return (
        <>
            <div  className={styles.upload}>
                <div {...getRootProps()} className={styles.dnd}>
                    <input {...getInputProps({ name: 'file' })} />
                    <Plus />
                    <p>Drag and Drop here or click to upload a new version</p>
                </div>
                <p>Or...</p>
                <div className={styles.dnd}>
                    <FormComponent inputs={[{name: "Link", type: 'text', value: file}]} onSave={(inputs) => {
                        let url = inputs[0].value
                        if(url) {
                            setFile(url)
                        }
                    }} />
                </div>
            </div>
        </>
    )
}

export default FileDropzone