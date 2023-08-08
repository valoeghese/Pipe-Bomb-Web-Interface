import { useState, useEffect, ReactNode } from "react";
import { localise, registerLanguageChangeListener, unregisterLanguageChangeListener } from "../logic/LanguageAdapter";
import Translation from "../logic/Translation";

/**
 * Get the translation for the provided translation key.
 * @param translationKey the translation key to look up in the current language.
 */
export default function useTranslation(translationKey: string) : Translation {
	const [translation, setTranslation] = useState(localise(translationKey));
	
	function onLanguageChange() {
		setTranslation(localise(translationKey));
	}

	useEffect(() => {
		registerLanguageChangeListener(onLanguageChange);

		return () => {
			unregisterLanguageChangeListener(onLanguageChange);
		};
	}, []);
	
	return translation;
}