import { Globe } from "react-feather";
import IconButton from "../Buttons/IconButton";
import { ContentTypes, IContentDoc, Locales } from "@/app/api/types";
import {Popup} from "../Popup/Popup";
import Select from "../FormInputs/Select";
import FormComponent from "../Form/Form";
import Text from "../FormInputs/Text";
import RichTextInput from "../FormInputs/RichText";
import { useState } from "react";
import { updateTranslation } from "@/app/api/content";
import { useI18n } from "@/locales/client";
import Link from "next/link";

export default function CreateTranslationForm({content, type}: {content: IContentDoc, type: ContentTypes}) {
    const [title, setTitle] = useState(content.title)
    const [shortDescription, setShortDescription] = useState(content.shortDescription)
    const [description, setDescription] = useState(content.description)
    const t = useI18n();

    const makeTranslation = () => {
        const availableLocales = Locales
        Popup.createPopup({title: "Create a New Translation", canClose: true, content: <FormComponent id="makeTranslation" onSave={(data) => {
            console.log(data)
            let lang = data[0]
            let translation: {[key: string]: {description: string, shortDescription: string, title: string, approved: boolean}} = {
            }
            translation[lang] = {
                title: data[1],
                shortDescription: data[2],
                description: data[3],
                approved: false
            }
            updateTranslation(content.slug, type, translation, sessionStorage.getItem('jwt'))
            }}>
            <Select name="Language" options={availableLocales.map(lang => {return {name: lang}})} onChange={(v: string) => {
                if(content.translations && Object.keys(content.translations).includes(v)) {
                    let translation = content.translations[v]
                    setTitle(translation.title)
                    setShortDescription(translation.shortDescription)
                    setDescription(translation.description)
                } else if (v === 'en-US') {
                    setTitle(content.title)
                    setShortDescription(content.shortDescription)
                    setDescription(content.description)
                }
            }} description={<Link href="https://github.com/BenMeie/mccreations-next/blob/main/docs/translating.md">{t('content.edit.translations.missing_language')}</Link>} />
            <Text name={t('content.create.title')} value={title}/>
            <Text name={t('content.create.short_description')} value={shortDescription}/>
            <RichTextInput name={t('content.edit.general.description')} value={description}/>
        </FormComponent>})
    }

    if(content.allowTranslations === false) return undefined
    return (
        <IconButton className="secondary" onClick={makeTranslation}><Globe /></IconButton>
    )
}