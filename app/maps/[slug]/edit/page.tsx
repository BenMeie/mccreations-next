'use client'

import { getUser } from "@/app/api/auth"
import { fetchMap, requestApproval, updateContent } from "@/app/api/content"
import { FilePreview, IFile, IMap, IUser, MinecraftVersion } from "@/app/types"
import MainButton from "@/components/Buttons/MainButton"
import ContentWarnings from "@/components/Content/ContentWarnings"
import FormComponent from "@/components/Form/Form"
import { UploadedImageRepresentation } from "@/components/FormInputs/ImageDropzone/ImageDropzone"
import MediaGallery from "@/components/FormInputs/MediaGallery/MediaGallery"
import VersionManager from "@/components/FormInputs/VersionUploader/VersionManager"
import { PopupMessage, PopupMessageType } from "@/components/PopupMessage/PopupMessage"
import Tabs from "@/components/Tabs/Tabs"
import { Params } from "next/dist/shared/lib/router/utils/route-matcher"
import { useEffect, useRef, useState } from "react"
import { ArrowLeft } from "react-feather"

export default function EditContentPage({params}: {params: Params}) {
    const [user, setUser] = useState<IUser>()
    const [map, setMap] = useState<IMap>()
    const token = useRef("")
    useEffect(() => {
        token.current = sessionStorage?.getItem('jwt') + ""
        console.log("Token is " + token.current)
        const getData = async () => {
            if(token && token.current.length > 0) {
                let u = await getUser(undefined, token.current)
                setUser(u);
                let m = await fetchMap(params.slug, token.current)
                setMap(m);
            } else {
                token.current = sessionStorage.getItem('temp_key') + ""
                let m = await fetchMap(params.slug, token + "")
                setMap(m);
            }
        }
        getData();
    }, [])

    let match = false;
    if(map && '_id' in map) {
        map?.creators?.forEach((creator) => {
            if(creator.handle && user && user.handle && creator.handle === user?.handle) {
                match = true
            }
        })
        if(map.status === 0) {
            match = true;
        }
    }
    if(match) {
        return (
            <div className="centered_content">
                <ContentWarnings map={map!} />
                <h1>Editing {map?.title}</h1>
                <p>Status: {(map?.status === 0) ? <span style={{color: "#c73030"}}>Draft</span> : (map?.status === 1) ? <span style={{color: "#f0b432"}}>Awaiting Approval</span> : (map?.status === 2) ? <span>Approved</span>: <span style={{color:"#3154f4"}}>Featured</span>}</p>
                {map?.status === 0 && (<MainButton onClick={() => {requestApproval(map!.slug, token.current).then(() => {PopupMessage.addMessage(new PopupMessage(PopupMessageType.Alert, "Request Sent"))})}}>Request Approval</MainButton>)}
                <Tabs preselectedTab={1} tabs={[
                {
                    title: <ArrowLeft />,
                    content: <></>,
                    link: `/maps/${map!.slug}`
                },
                {
                    
                    // General Tab
                    title: "General",
                    content: <FormComponent inputs={[
                            { type: 'text', name: 'Title', value: map?.title },
                            { type: 'text', name: 'Slug', value: map?.slug},
                            { type: 'creator', name: 'Creators', value: JSON.stringify(map!.creators) },
                            { type: 'text', name: 'Short Description', value: map?.shortDescription },
                            { type: 'text', name: "Video URL", value: map?.videoUrl },
                            { type: 'long_text', name: 'Description', value: map?.description },
                        ]} onSave={(inputs) => {
                            let newMap: IMap = {
                                ...map!
                            }
                            
                            if(inputs[0].value) {
                                newMap.title = inputs[0].value
                            } else {
                                PopupMessage.addMessage(new PopupMessage(PopupMessageType.Error, 'No title entered'))
                            }
        
                            if(inputs[1].value) {
                                newMap.slug = inputs[1].value
                            } else {
                                PopupMessage.addMessage(new PopupMessage(PopupMessageType.Error, 'No slug entered'))
                            }
        
                            if(inputs[2].value) {
                                newMap.creators = JSON.parse(inputs[2].value)
                            } else {
                                PopupMessage.addMessage(new PopupMessage(PopupMessageType.Error, 'No creator entered'))
                            }
        
                            if(inputs[3].value) {
                                newMap.shortDescription = inputs[3].value
                                if(inputs[3].value.length < 20) {
                                    PopupMessage.addMessage(new PopupMessage(PopupMessageType.Warning, "Short description needs to be longer than 20 characters"))
                                }
                            } else {
                                PopupMessage.addMessage(new PopupMessage(PopupMessageType.Error, 'No short description entered'))
                            }
        
                            if(inputs[4].value) {
                                newMap.videoUrl = inputs[4].value
                            }
        
                            if(inputs[5].value) {
                                newMap.description = inputs[5].value
                            } else {
                                PopupMessage.addMessage(new PopupMessage(PopupMessageType.Error, "No description entered"))
                            }

                            updateContent(newMap, token.current).then((error) => {
                                if(error.message) {
                                    PopupMessage.addMessage(new PopupMessage(PopupMessageType.Error, error.message))
                                    return;
                                }
                                setMap(newMap)
                                PopupMessage.addMessage(new PopupMessage(PopupMessageType.Alert, 'Map info saved successfully'))
                            }).catch((e) => {
                                PopupMessage.addMessage(new PopupMessage(PopupMessageType.Error, e.error))
                            })
                        }} />
                    },{

                    // Images Tab
                    title: "Images",
                    content: <MediaGallery onImagesUploaded={(files) => {
                        let newMap: IMap = {
                            ...map!
                        }
                        newMap.images = files.map(f => f.url)
                        updateContent(newMap, token.current).then(() => {
                            setMap(newMap)
                            PopupMessage.addMessage(new PopupMessage(PopupMessageType.Alert, 'Images saved successfully'))
                        }).catch((e) => {
                            PopupMessage.addMessage(new PopupMessage(PopupMessageType.Error, e.error))
                        })
                    }} presetFiles={JSON.stringify(map?.images.map(image => {return {url: image, name: image}}))}/>
                    }, {

                    // Versions Tab
                    title: "Versions",
                    content: <VersionManager presetVersions={JSON.stringify(map?.files)} onVersionsChanged={(vString) => {
                        let newMap: IMap = {
                            ...map!
                        }
                        newMap.files = JSON.parse(vString)
                        
                        newMap.files.sort((a, b) => {
                            return parseFloat(b.contentVersion) - parseFloat(a.contentVersion)
                        })

                        updateContent(newMap, token.current).then(() => {
                            setMap(newMap)
                            PopupMessage.addMessage(new PopupMessage(PopupMessageType.Alert, 'Versions saved successfully'))
                        }).catch((e) => {
                            PopupMessage.addMessage(new PopupMessage(PopupMessageType.Error, e.error))
                        })
                    }} />
                    }]} />
            </div>
        )
    }
    return (
        <>
        {(map) ? <p>Error</p> : ""}
        </>
    )
}