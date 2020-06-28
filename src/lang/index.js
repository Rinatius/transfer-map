import LocalizedStrings from "react-localization";
import en from "./en";
import ru from "./ru";
import ky from "./ky";

const langStrings = new LocalizedStrings({
  en,
  ru,
  ky
});

if (process.env.REACT_APP_LANG){
	switch (process.env.REACT_APP_LANG) {
		case 'ru':
			langStrings.setLanguage('ru');
			break;
		
		case 'ky':
			langStrings.setLanguage('ky');
			break;
		default:
			langStrings.setLanguage('en');
			break;
	}
}


export default langStrings;
