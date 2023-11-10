import Menu from '@/components/Menu';
import Rating from '@/components/Rating';
import { JSDOM } from 'jsdom';
import DOMPurify from 'dompurify';
import CreatorCard from '@/components/cards/CreatorCard';
import FileCard from '@/components/cards/FileCard';
import Image from 'next/image';
import Link from 'next/link';
import MapImageSlideshow from '@/components/slideshows/MapImageSlideshow';
import Comments from '@/components/Comments';
import '../../styles/mapPage.css'
import { fetchMap, fetchMaps } from '@/app/getData';
import { Params } from 'next/dist/shared/lib/router/utils/route-matcher';
import { ICreator, IFile, IMap } from '@/app/types';

const window = new JSDOM('').window;
const purify = DOMPurify(window);

export async function generateStaticParams() {
    const maps = await fetchMaps({}, false)
    return maps.map((map: IMap) => ({
        slug: map.slug
    }))
}

export default async function Page({params}: {params: Params}) {
    console.log("Looking for map with slug " + params.slug)
    const map = await fetchMap(params.slug)

    let videoID = ""
    if(map.videoUrl && map.videoUrl.includes("?v=")) {
        videoID = map.videoUrl.substring(map.videoUrl.indexOf("?v=") + 3)
    } else if(map.videoUrl) {
        videoID = map.videoUrl.substring(map.videoUrl.lastIndexOf("/") + 1)
    }

    console.log(map.images)

    if(map) {
        return (
            <>
            <Menu selectedPage={"maps"}></Menu>
            <div className='map_page'>
                <Image className='image_background' width={1920} height={1080} src={map.images[0]} alt=""></Image>
                <div className='map_logo_foreground'>
                    <div className='map_logo_container'>
                        {(map.videoUrl) ?  <div className='map_video'><iframe width="100%" height="100%" style={{aspectRatio: 16/9}} src={`https://www.youtube-nocookie.com/embed/${videoID}`} title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen></iframe></div>: <Image className='map_logo' width={1920} height={1080} src={map.images[0]} alt={`The logo for ${map.title}, a Minecraft Map for ${map.files[0].minecraftVersion} by ${map.creators[0].username}`}></Image>}
                    </div>
                </div>
                <div className='centered_content'>
                    <div className='map_title_bar'>
                        <div className="map_title_stack">
                            <h1 className='map_title'>{map.title}</h1>
                        </div>
                        <div className='map_download_stack'>
                            <Rating value={map.rating} content={map} />
                            <Link href={map.files[0].worldUrl} className='main_button'>Download</Link>
                        </div>
                    </div>
                    <div className='map_information'>
                        <div className='map_description' dangerouslySetInnerHTML={{__html: purify.sanitize(map.description)}}>       
                        </div>
                        <div className='map_sidebar'>
                            <section className='map_sidebar_section'>
                                <h4 className='header'>Creators</h4>
                                {map.creators.map((creator: ICreator, idx: number) => <CreatorCard key={idx} creator={creator} />)}
                            </section>
                            <section className='map_sidebar_section stats'>
                                <h4 className='header'>Stats</h4>
                                <p className='stat_header'>Downloads <span className='stat'>{map.downloads}</span></p>
                                <p className='stat_header'>Ratings <span className='stat'>{(map.ratings) ? map.ratings.length : 0}</span></p>
                                <p className='stat_header'>Minecraft Version <span className='stat'>{map.files[0].minecraftVersion}</span></p>
                                <p className='stat_header'>Created Date <span className='stat'>{new Date(map.createdDate).toLocaleDateString()}</span></p>
                                <p className='stat_header'>Updated Date <span className='stat'>{new Date(map.updatedDate).toLocaleDateString()}</span></p>
                            </section>
                            <section className='map_sidebar_section'>
                                <h4 className='header'>Files</h4>
                                {map.files.map((file: IFile, idx: number) => <FileCard key={idx} file={file} />)}
                            </section>
                        </div>
                    </div>
                </div>
                <MapImageSlideshow images={map.images.slice(1)} />
                <Comments mapSlug={map.slug} comments={map.comments}/>
            </div>
            </>
        )
    } else {
        return (
            <div>
                <h1>Map Not Found</h1>
            </div>
        )
    }

}