'use client'

import { IMap } from "@/app/types";
import ContentCard from "./ContentCard";
import styles from './ContentSlideshow.module.css'

export default function ContentSlideshow({content, playlist}: {content: IMap[], playlist: string}) {

    const slideButtonClicked = (left: boolean, e: any) => {
        e.preventDefault();
        let elem
        if(left) {
            elem = document.querySelector(`#${playlist}_${0}`)
        } else {
            elem = document.querySelector(`#${playlist}_${9}`)
        }
        document.querySelector(`#${playlist}`)?.scrollTo({
            left: elem?.getBoundingClientRect().left,
            behavior: "smooth"
        })
    }

    return (
        <div className={styles.slideshow}>
            <img className={`${styles.nav_arrow} ${styles.left}`}  src="/chev-left.svg" onClick={(e) => {slideButtonClicked(true, e)}}></img>
            <img className={`${styles.nav_arrow} ${styles.right}`} src="/chev-right.svg" onClick={(e) => {slideButtonClicked(false, e)}}></img>
            <div className={styles.scroll_window} id={playlist}>
                {content.map((map: IMap, idx: number) => <ContentCard key={idx} content={map} playlist={"newest"} index={idx} priority={true}></ContentCard>)}
            </div>
        </div>
    )
}