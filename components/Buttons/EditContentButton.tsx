'use client'

import { getUser } from "@/app/api/auth";
import { getCreator } from "@/app/api/community";
import { ICreator, IUser } from "@/app/types";
import Link from "next/link";
import { useEffect, useState } from "react";
import MainButton from "./MainButton";

export default function EditContentButton({slug, creators, status}: {slug: string, creators: ICreator[], status: number}) {
    const [user, setUser] = useState<IUser>()
    useEffect(() => {
        let token = sessionStorage?.getItem('jwt')
        const getData = async () => {
            if(token) {
                let u = await getUser(undefined, token)
                setUser(u);
            }
        }
        getData();
    }, [])

    let match = false;
    creators && creators.forEach((creator) => {
        if(creator.handle && user && user.handle && creator.handle === user?.handle) {
            match = true
        }
    })
    if(status === 0) match = true
    if(match) {
        return (
            <Link href={`./${slug}/edit`}><MainButton>Edit</MainButton></Link>
        )
    }
    return (<></>)
}