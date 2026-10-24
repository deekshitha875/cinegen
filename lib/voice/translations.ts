// lib/voice/translations.ts
export interface Translations {
  greeting: string;
  listeningHint: string;
  wakeWord: string;
  placeholder: string;
  enableVoice: string;
  typeInstead: string;
  useVoice: string;
  send: string;
  thinking: string;
  errorMic: string;
  errorApi: string;
  rateLimit: string;
}

export const translations: Record<string, Translations> = {
  en: {
    greeting: "Hi! I'm your CineGen Voice Director. Say 'Hey CineGen' or type to start.",
    listeningHint: "Say 'Hey CineGen' to wake me up",
    wakeWord: "Hey CineGen",
    placeholder: "Type your brief idea here…",
    enableVoice: "Enable Voice Assistant",
    typeInstead: "Type instead",
    useVoice: "Use voice",
    send: "Send",
    thinking: "Thinking…",
    errorMic: "Microphone access denied. Please allow microphone access.",
    errorApi: "Something went wrong. Please try again.",
    rateLimit: "Too many requests. Please wait a moment.",
  },
  te: {
    greeting: "హాయ్! నేను మీ CineGen వాయిస్ డైరెక్టర్. 'Hey CineGen' అని చెప్పండి లేదా టైప్ చేయండి.",
    listeningHint: "'Hey CineGen' అని చెప్పి మేల్కొలపండి",
    wakeWord: "Hey CineGen",
    placeholder: "మీ ఐడియా టైప్ చేయండి…",
    enableVoice: "వాయిస్ అసిస్టెంట్ ప్రారంభించండి",
    typeInstead: "బదులుగా టైప్ చేయండి",
    useVoice: "వాయిస్ ఉపయోగించండి",
    send: "పంపండి",
    thinking: "ఆలోచిస్తున్నాను…",
    errorMic: "మైక్రోఫోన్ అనుమతి నిరాకరించబడింది.",
    errorApi: "ఏదో తప్పు జరిగింది. దయచేసి మళ్ళీ ప్రయత్నించండి.",
    rateLimit: "చాలా అభ్యర్థనలు. దయచేసి కొంత సేపు వేచి ఉండండి.",
  },
  hi: {
    greeting: "नमस्ते! मैं आपका CineGen वॉइस डायरेक्टर हूँ। 'Hey CineGen' कहें या टाइप करें।",
    listeningHint: "'Hey CineGen' कहकर जगाएं",
    wakeWord: "Hey CineGen",
    placeholder: "अपना आइडिया यहाँ टाइप करें…",
    enableVoice: "वॉइस असिस्टेंट चालू करें",
    typeInstead: "टाइप करें",
    useVoice: "वॉइस इस्तेमाल करें",
    send: "भेजें",
    thinking: "सोच रहा हूँ…",
    errorMic: "माइक्रोफोन अनुमति अस्वीकार कर दी गई।",
    errorApi: "कुछ गड़बड़ हो गई। कृपया पुनः प्रयास करें।",
    rateLimit: "बहुत अधिक अनुरोध। कृपया थोड़ी देर प्रतीक्षा करें।",
  },
  ta: {
    greeting: "வணக்கம்! நான் உங்கள் CineGen குரல் இயக்குனர். 'Hey CineGen' என்று சொல்லுங்கள் அல்லது தட்டச்சு செய்யுங்கள்.",
    listeningHint: "'Hey CineGen' என்று சொல்லி எழுப்புங்கள்",
    wakeWord: "Hey CineGen",
    placeholder: "உங்கள் யோசனையை இங்கே தட்டச்சு செய்யுங்கள்…",
    enableVoice: "குரல் உதவியாளரை இயக்கு",
    typeInstead: "தட்டச்சு செய்யுங்கள்",
    useVoice: "குரலைப் பயன்படுத்துங்கள்",
    send: "அனுப்பு",
    thinking: "யோசிக்கிறேன்…",
    errorMic: "மைக்ரோஃபோன் அணுகல் மறுக்கப்பட்டது.",
    errorApi: "ஏதோ தவறு நடந்தது. மீண்டும் முயலுங்கள்.",
    rateLimit: "அதிகமான கோரிக்கைகள். சிறிது நேரம் காத்திருங்கள்.",
  },
  kn: {
    greeting: "ನಮಸ್ಕಾರ! ನಾನು ನಿಮ್ಮ CineGen ವಾಯ್ಸ್ ಡೈರೆಕ್ಟರ್. 'Hey CineGen' ಹೇಳಿ ಅಥವಾ ಟೈಪ್ ಮಾಡಿ.",
    listeningHint: "'Hey CineGen' ಎಂದು ಹೇಳಿ ಎಚ್ಚರಿಸಿ",
    wakeWord: "Hey CineGen",
    placeholder: "ನಿಮ್ಮ ಐಡಿಯಾ ಇಲ್ಲಿ ಟೈಪ್ ಮಾಡಿ…",
    enableVoice: "ವಾಯ್ಸ್ ಅಸಿಸ್ಟೆಂಟ್ ಆರಂಭಿಸಿ",
    typeInstead: "ಬದಲಿಗೆ ಟೈಪ್ ಮಾಡಿ",
    useVoice: "ವಾಯ್ಸ್ ಬಳಸಿ",
    send: "ಕಳುಹಿಸಿ",
    thinking: "ಯೋಚಿಸುತ್ತಿದ್ದೇನೆ…",
    errorMic: "ಮೈಕ್ರೋಫೋನ್ ಪ್ರವೇಶ ನಿರಾಕರಿಸಲಾಗಿದೆ.",
    errorApi: "ಏನೋ ತಪ್ಪಾಯಿತು. ದಯವಿಟ್ಟು ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.",
    rateLimit: "ಹೆಚ್ಚಿನ ವಿನಂತಿಗಳು. ದಯವಿಟ್ಟು ಸ್ವಲ್ಪ ಕಾಯಿರಿ.",
  },
  ml: {
    greeting: "ഹലോ! ഞാൻ നിങ്ങളുടെ CineGen വോയ്‌സ് ഡയറക്ടർ ആണ്. 'Hey CineGen' പറയുക അല്ലെങ്കിൽ ടൈപ്പ് ചെയ്യുക.",
    listeningHint: "'Hey CineGen' പറഞ്ഞ് ഉണർത്തുക",
    wakeWord: "Hey CineGen",
    placeholder: "നിങ്ങളുടെ ആശയം ഇവിടെ ടൈപ്പ് ചെയ്യുക…",
    enableVoice: "വോയ്‌സ് അസിസ്റ്റന്റ് ആരംഭിക്കുക",
    typeInstead: "പകരം ടൈപ്പ് ചെയ്യുക",
    useVoice: "ശബ്ദം ഉപയോഗിക്കുക",
    send: "അയക്കുക",
    thinking: "ചിന്തിക്കുന്നു…",
    errorMic: "മൈക്രോഫോൺ ആക്സസ് നിരസിച്ചു.",
    errorApi: "എന്തോ തകരാർ. വീണ്ടും ശ്രമിക്കൂ.",
    rateLimit: "അധിക അഭ്യർത്ഥനകൾ. അൽപ്പം കാത്തിരിക്കുക.",
  },
  mr: {
    greeting: "नमस्कार! मी तुमचा CineGen व्हॉइस डायरेक्टर आहे. 'Hey CineGen' म्हणा किंवा टाइप करा.",
    listeningHint: "'Hey CineGen' म्हणून जागे करा",
    wakeWord: "Hey CineGen",
    placeholder: "तुमची कल्पना येथे टाइप करा…",
    enableVoice: "व्हॉइस असिस्टंट सुरू करा",
    typeInstead: "त्याऐवजी टाइप करा",
    useVoice: "आवाज वापरा",
    send: "पाठवा",
    thinking: "विचार करतोय…",
    errorMic: "मायक्रोफोन परवानगी नाकारली.",
    errorApi: "काहीतरी चुकले. कृपया पुन्हा प्रयत्न करा.",
    rateLimit: "खूप जास्त विनंत्या. कृपया थोडा वेळ थांबा.",
  },
  bn: {
    greeting: "হ্যালো! আমি আপনার CineGen ভয়েস ডিরেক্টর। 'Hey CineGen' বলুন বা টাইপ করুন।",
    listeningHint: "'Hey CineGen' বলে জাগিয়ে তুলুন",
    wakeWord: "Hey CineGen",
    placeholder: "আপনার আইডিয়া এখানে টাইপ করুন…",
    enableVoice: "ভয়েস অ্যাসিস্ট্যান্ট চালু করুন",
    typeInstead: "পরিবর্তে টাইপ করুন",
    useVoice: "ভয়েস ব্যবহার করুন",
    send: "পাঠান",
    thinking: "ভাবছি…",
    errorMic: "মাইক্রোফোন অ্যাক্সেস অস্বীকার করা হয়েছে।",
    errorApi: "কিছু একটা ভুল হয়েছে। আবার চেষ্টা করুন।",
    rateLimit: "অনেক বেশি অনুরোধ। একটু অপেক্ষা করুন।",
  },
  gu: {
    greeting: "નમસ્તે! હું તમારો CineGen વૉઇસ ડિરેક્ટર છું. 'Hey CineGen' કહો અથવા ટાઇપ કરો.",
    listeningHint: "'Hey CineGen' કહીને જગાડો",
    wakeWord: "Hey CineGen",
    placeholder: "તમારો વિચાર અહીં ટાઇપ કરો…",
    enableVoice: "વૉઇસ આસિસ્ટન્ટ ચાલુ કરો",
    typeInstead: "ટાઇપ કરો",
    useVoice: "વૉઇસ વાપરો",
    send: "મોકલો",
    thinking: "વિચારી રહ્યો છું…",
    errorMic: "માઇક્રોફોન ઍક્સેસ નકારી.",
    errorApi: "કંઈક ખોટું થયું. ફરી પ્રયત્ન કરો.",
    rateLimit: "ઘણી બધી વિનંતીઓ. થોડી રાહ જુઓ.",
  },
  pa: {
    greeting: "ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ! ਮੈਂ ਤੁਹਾਡਾ CineGen ਵੌਇਸ ਡਾਇਰੈਕਟਰ ਹਾਂ। 'Hey CineGen' ਕਹੋ ਜਾਂ ਟਾਈਪ ਕਰੋ।",
    listeningHint: "'Hey CineGen' ਕਹਿ ਕੇ ਜਗਾਓ",
    wakeWord: "Hey CineGen",
    placeholder: "ਆਪਣਾ ਖਿਆਲ ਇੱਥੇ ਟਾਈਪ ਕਰੋ…",
    enableVoice: "ਵੌਇਸ ਅਸਿਸਟੈਂਟ ਸ਼ੁਰੂ ਕਰੋ",
    typeInstead: "ਬਦਲੇ ਵਿੱਚ ਟਾਈਪ ਕਰੋ",
    useVoice: "ਵੌਇਸ ਵਰਤੋ",
    send: "ਭੇਜੋ",
    thinking: "ਸੋਚ ਰਿਹਾ ਹਾਂ…",
    errorMic: "ਮਾਈਕ੍ਰੋਫੋਨ ਪਹੁੰਚ ਤੋਂ ਇਨਕਾਰ ਕੀਤਾ।",
    errorApi: "ਕੁਝ ਗਲਤ ਹੋਇਆ। ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼ ਕਰੋ।",
    rateLimit: "ਬਹੁਤ ਸਾਰੀਆਂ ਬੇਨਤੀਆਂ। ਕਿਰਪਾ ਕਰਕੇ ਉਡੀਕ ਕਰੋ।",
  },
};

export function getTranslations(langCode: string): Translations {
  return translations[langCode] ?? translations["en"];
}
