import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';

type Lang = 'en' | 'hi';

type I18nContextValue = {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: string, fallback?: string) => string;
};

const translations: Record<Lang, Record<string, string>> = {
  en: {},
  hi: {
    // global
    'VendorHub': 'VendorHub',
    'Dashboard': 'डैशबोर्ड',
    'Sales & Finance': 'बिक्री और वित्त',
    'Hygiene': 'स्वच्छता',
    'Promotion': 'प्रमोशन',
    'Complaint': 'शिकायत',
    'Profile': 'प्रोफ़ाइल',
    'Logout': 'लॉगआउट',
    'Language': 'भाषा',
    'Last certificate': 'अंतिम प्रमाणपत्र',
    'Not uploaded': 'अपलोड नहीं किया गया',
    'Login': 'लॉगिन',
    'Register': 'रजिस्टर',
    'Policies': 'नीतियाँ',
    'Back': 'वापस',
    'Back to Home': 'मुख्य पृष्ठ पर जाएं',
    'Back to Dashboard': 'डैशबोर्ड पर लौटें',
    'Save': 'सहेजें',
    'Saving...': 'सहेजा जा रहा है...',
    'Submit': 'जमा करें',
    'Submitting...': 'जमा हो रहा है...',
    'Cancel': 'रद्द करें',
    'Apply for Loan': 'ऋण के लिए आवेदन करें',
    'Report Bribery': 'रिश्वत की रिपोर्ट करें',
    'Upload and verify': 'अपलोड करें और सत्यापित करें',
    'Set up payments': 'भुगतान सेट करें',

    // Landing
    'Empower Street Vendors. Build Better Livelihoods.': 'स्ट्रीट वेंडरों को सशक्त करें। बेहतर आजीविका बनाएं।',
    'VendorHub connects street vendors with the tools, support, and resources they need to grow their businesses, improve their income, and achieve financial stability.': 'VendorHub स्ट्रीट वेंडरों को वह उपकरण, सहायता और संसाधन देता है जिससे वे अपना व्यवसाय बढ़ा सकें, आय सुधार सकें और आर्थिक स्थिरता पा सकें।',
    'Start as Vendor': 'विक्रेता के रूप में शुरू करें',
    'View as NGO': 'एनजीओ के रूप में देखें',
    'Street Vendor Policies': 'स्ट्रीट वेंडर नीतियाँ',
    'Know your rights, avoid fines, and access schemes like PM SVANidhi and TVC vending certificates.': 'अपने अधिकार जानें, जुर्माने से बचें, और पीएम स्वनिधि व टीवीसी वेंडिंग प्रमाणपत्र जैसी योजनाओं का लाभ लें।',
    'View policies': 'नीतियाँ देखें',
    'How We Help': 'हम कैसे मदद करते हैं',
    'Income Growth': 'आय में वृद्धि',
    'Track sales & access microloans': 'बिक्री ट्रैक करें और सूक्ष्म ऋण पाएं',
    'Legal Identity': 'कानूनी पहचान',
    'Upload certificates & licenses': 'सर्टिफिकेट और लाइसेंस अपलोड करें',
    'Digital Payments': 'डिजिटल भुगतान',
    'Enable online transactions': 'ऑनलाइन भुगतान सक्षम करें',
    'Increase online visibility': 'ऑनलाइन दृश्यता बढ़ाएं',
    'Community': 'समुदाय',
    'Connect with other vendors': 'अन्य वेंडरों से जुड़ें',
    'Ready to Transform Your Business?': 'क्या आप अपना व्यवसाय बदलने के लिए तैयार हैं?',
    'Join thousands of vendors already earning better with VendorHub.': 'हजारों विक्रेताओं की तरह VendorHub के साथ अधिक कमाएं।',
    'Register Now': 'अभी रजिस्टर करें',
    'VendorHub © 2024. Empowering Street Vendors Nationwide.': 'VendorHub © 2024. देशभर के स्ट्रीट वेंडरों को सशक्त कर रहा है।',

    // Policies page
    'Government Policies': 'सरकारी नीतियाँ',
    'Policies for Street Vendors': 'स्ट्रीट वेंडरों के लिए नीतियाँ',
    'Stay compliant': 'अनुपालन में रहें',
    'Understand your rights, access benefits, and avoid penalties by following these official policies and schemes.': 'इन आधिकारिक नीतियों और योजनाओं का पालन करके अपने अधिकार समझें, लाभ पाएं और दंड से बचें।',
    'Filter by region (e.g., India)': 'क्षेत्र अनुसार छांटें (जैसे, India)',
    'Clear': 'साफ करें',
    'Know your rights and protections': 'अपने अधिकार और संरक्षण जानें',
    'Find region-specific guidance': 'क्षेत्र-विशिष्ट मार्गदर्शन पाएँ',
    'Access official sources quickly': 'आधिकारिक स्रोतों तक जल्दी पहुँचें',
    'Loading policies...': 'नीतियाँ लोड हो रही हैं...',
    'No policies found for this region yet.': 'इस क्षेत्र के लिए अभी कोई नीति नहीं मिली।',
    'Source': 'स्रोत',
    'Why this helps vendors': 'यह विक्रेताओं की कैसे मदद करता है',
    'Prevents unexpected fines or eviction by following official vending rules.': 'आधिकारिक वेंडिंग नियमों का पालन कर अचानक जुर्माना या बेदखली से बचाता है।',
    'Unlocks financial schemes like PM SVANidhi for working capital and subsidies.': 'पीएम स्वनिधि जैसी वित्तीय योजनाओं से कार्यशील पूँजी और सब्सिडी का लाभ दिलाता है।',
    'Clarifies documentation needed for vending certificates and ID cards.': 'वेंडिंग प्रमाणपत्र और आईडी कार्ड के लिए आवश्यक दस्तावेज स्पष्ट करता है।',
    'Gives trusted links to apply or read details directly from government sites.': 'सरकारी साइटों से सीधे आवेदन/जानकारी के विश्वसनीय लिंक देता है।',

    // Policy titles & summaries
    'Street Vendors (Protection of Livelihood and Regulation of Street Vending) Act, 2014': 'स्ट्रीट वेंडर्स (जीविका संरक्षण और स्ट्रीट वेंडिंग विनियमन) अधिनियम, 2014',
    'Defines rights of urban street vendors, mandates Town Vending Committees (TVCs), protects from arbitrary evictions, and outlines vending certificates.': 'शहरी स्ट्रीट वेंडरों के अधिकार तय करता है, टाउन वेंडिंग कमेटियों (TVC) को अनिवार्य करता है, मनमाने निष्कासन से बचाता है और वेंडिंग प्रमाणपत्र की रूपरेखा देता है।',

    'Model Street Vendor Policy (MoHUA)': 'मॉडल स्ट्रीट वेंडर नीति (आवास एवं शहरी कार्य मंत्रालय)',
    'Guidelines from Ministry of Housing and Urban Affairs to operationalize the Act, including vending zones, grievance redressal, and inclusive planning.': 'आवास एवं शहरी कार्य मंत्रालय की दिशानिर्देश जो अधिनियम को लागू करने में मदद करती हैं—वेंडिंग ज़ोन, शिकायत निवारण, और समावेशी योजना सहित।',

    'PM SVANidhi Micro-Credit Scheme': 'पीएम स्वनिधि सूक्ष्म-ऋण योजना',
    'Collateral-free working capital loans for street vendors with interest subsidy and digital transactions incentives.': 'स्ट्रीट वेंडरों के लिए बिना जमानत कार्यशील पूँजी ऋण, ब्याज सब्सिडी और डिजिटल लेनदेन प्रोत्साहन।',

    'Urban Street Vendors Scheme (State-specific)': 'शहरी स्ट्रीट वेंडर योजना (राज्य विशेष)',
    'State/ULB-level implementations for vending certificates, designated vending zones, and social security linkages aligned to the 2014 Act.': 'राज्य/यूएलबी स्तर पर वेंडिंग प्रमाणपत्र, निर्धारित वेंडिंग ज़ोन, और सामाजिक सुरक्षा जोड़ जो 2014 अधिनियम के अनुरूप हैं।',

    // Login
    'Welcome Back': 'वापसी पर स्वागत है',
    'Sign in to your vendor account': 'अपने विक्रेता खाते में साइन इन करें',
    'Email': 'ईमेल',
    'Password': 'पासवर्ड',
    'Sign In': 'साइन इन करें',
    'Signing in...': 'साइन इन हो रहा है...',
    "Don't have an account? Register": 'खाता नहीं है? रजिस्टर करें',
    'Use your email and password to sign in. If you need an account, register first.': 'साइन इन के लिए ईमेल और पासवर्ड का उपयोग करें। खाते की आवश्यकता है तो पहले रजिस्टर करें।',

    // Registration
    'Register as Vendor': 'विक्रेता के रूप में रजिस्टर करें',
    'Complete your profile in 3 steps': 'अपनी प्रोफ़ाइल 3 चरणों में पूरी करें',
    'Shop & Contact': 'दुकान और संपर्क',
    'Login & Documents': 'लॉगिन और दस्तावेज़',
    'Vendor Details': 'विक्रेता विवरण',
    'Hygiene Check': 'स्वच्छता जांच',
    'Shop Name': 'दुकान का नाम',
    "Owner's Full Name": 'मालिक का पूरा नाम',
    'Contact Number': 'संपर्क नंबर',
    'Full Address': 'पूरा पता',
    'Pincode': 'पिनकोड',
    'Next': 'आगे',
    'Email for Login': 'लॉगिन के लिए ईमेल',
    'Create Password': 'पासवर्ड बनाएं',
    'Confirm Password': 'पासवर्ड की पुष्टि करें',
    
    'FSSAI License Number (Optional)': 'FSSAI लाइसेंस नंबर (वैकल्पिक)',
    'GST Number (Optional)': 'GST नंबर (वैकल्पिक)',
    'Hygiene & Cleanliness Checklist': 'स्वच्छता और साफ-सफाई चेकलिस्ट',
    'Confirm your commitment to hygiene standards': 'स्वच्छता मानकों के लिए अपनी प्रतिबद्धता की पुष्टि करें',
    'Complete Registration': 'रजिस्ट्रेशन पूरा करें',
    
    'Please confirm all hygiene and cleanliness checks.': 'कृपया सभी स्वच्छता और साफ-सफाई जाँच पुष्टि करें।',

    // Dashboard
    'Welcome back': 'स्वागत है',
    "Log today's sales": 'आज की बिक्री दर्ज करें',
    'Enter your sales to update today and monthly totals.': 'आज और मासिक कुल अपडेट करने के लिए बिक्री दर्ज करें।',
    'This month': 'इस महीने',
    'Loading your sales data...': 'आपका बिक्री डेटा लोड हो रहा है...',
    "Today's Sales": 'आज की बिक्री',
    'Monthly Income': 'मासिक आय',
    'Loan Eligibility': 'ऋण पात्रता',
    'Hygiene Score': 'स्वच्छता स्कोर',
    'Vendor': 'विक्रेता',
    'Daily Sales (last 14 days)': 'दैनिक बिक्री (पिछले 14 दिन)',
    'Shows what you logged each day.': 'हर दिन दर्ज की गई बिक्री दिखाता है।',
    'No daily sales logged yet.': 'अभी तक कोई दैनिक बिक्री नहीं दर्ज है।',
    'Quick Actions': 'त्वरित क्रियाएँ',
    'Upload Certificate': 'प्रमाणपत्र अपलोड करें',
    'Promote Your Stall': 'अपनी स्टॉल को प्रमोट करें',
    'Enable Payments': 'भुगतान सक्षम करें',
    'Submit a confidential complaint': 'गोपनीय शिकायत जमा करें',
    'Legal Status': 'कानूनी स्थिति',
    'Certificate Status': 'प्रमाणपत्र स्थिति',
    'Pending': 'लंबित',
    'Recent Activity': 'हाल की गतिविधि',

    // Finance
    
    'Track your income and explore loan options': 'अपनी आय ट्रैक करें और ऋण विकल्प देखें',
    "Log Today's Sales": 'आज की बिक्री दर्ज करें',
    'Store your daily sales and see monthly totals & charts.': 'अपनी दैनिक बिक्री सहेजें और मासिक कुल व चार्ट देखें।',
    "Enter today's sales (₹)": 'आज की बिक्री दर्ज करें (₹)',
    'Save Sales': 'बिक्री सहेजें',
    'Average Daily Sales': 'औसत दैनिक बिक्री',
    '6-Month Sales Trend': '6 महीने की बिक्री प्रवृत्ति',
    'Credit Score': 'क्रेडिट स्कोर',
    'Good Payment History': 'अच्छा भुगतान इतिहास',
    'No defaults recorded': 'कोई डिफॉल्ट दर्ज नहीं',
    'Stable Income': 'स्थिर आय',
    'High Hygiene Standards': 'उच्च स्वच्छता मानक',
    'Data not yet provided': 'डेटा अभी उपलब्ध नहीं',
    
    'You are eligible for a loan!': 'आप ऋण के लिए पात्र हैं!',
    'Loan Application': 'ऋण आवेदन',
    'Loan Amount (₹)': 'ऋण राशि (₹)',
    'Min': 'न्यूनतम',
    'Max': 'अधिकतम',
    'Loan Purpose': 'ऋण का उद्देश्य',
    'Equipment & Tools': 'उपकरण और औज़ार',
    'Stock & Inventory': 'स्टॉक और इन्वेंटरी',
    'Stall Expansion': 'स्टॉल विस्तार',
    'Business Establishment': 'व्यवसाय स्थापना',
    'Other': 'अन्य',
    'Loan Details': 'ऋण विवरण',
    'Tenure': 'अवधि',
    'Months': 'महीने',
    'Interest Rate': 'ब्याज दर',
    'Monthly EMI': 'मासिक ईएमआई',
    'Submit Application': 'आवेदन जमा करें',
    'Money Tips': 'धन संबंधी सुझाव',
    'Save at least 10% of your daily earnings': 'दैनिक आय का कम से कम 10% बचाएं',
    'Keep business expenses separate from personal': 'व्यावसायिक खर्चों को व्यक्तिगत खर्चों से अलग रखें',
    'Maintain a monthly income record for loan qualification': 'ऋण पात्रता के लिए मासिक आय रिकॉर्ड रखें',
    'Reduce loan interest through early repayment': 'जल्द भुगतान करके ब्याज घटाएं',
    
    'View Promotion': 'प्रमोशन देखें',

    // Hygiene
    'Hygiene & Cleanliness': 'स्वच्छता और साफ-सफाई',
    'Track your hygiene score and get improvement tips': 'अपना स्वच्छता स्कोर ट्रैक करें और सुधार सुझाव पाएं',
    'Your Hygiene Score': 'आपका स्वच्छता स्कोर',
    'Cleanliness Checklist': 'साफ-सफाई चेकलिस्ट',
    'No hygiene items yet. Add your checklist to start tracking.': 'अभी कोई स्वच्छता आइटम नहीं हैं। ट्रैकिंग शुरू करने के लिए अपनी चेकलिस्ट जोड़ें।',
    'Improvement Tips': 'सुधार के सुझाव',
    'Did you know?': 'क्या आप जानते हैं?',
    'Vendors with a hygiene score above 80% receive 20% higher customer trust ratings and can qualify for premium promotional features on VendorHub!': '80% से अधिक स्वच्छता स्कोर वाले विक्रेताओं को 20% अधिक ग्राहक भरोसा मिलता है और वे VendorHub पर प्रीमियम प्रमोशनल फीचर्स के लिए पात्र हो सकते हैं!',
      'Stall Maintenance': 'स्टॉल रखरखाव',
      'Personal Hygiene': 'व्यक्तिगत स्वच्छता',
      'Food Safety': 'खाद्य सुरक्षा',
      'Clean and disinfect your stall daily': 'अपनी स्टॉल रोज साफ और कीटाणुरहित करें',
      'Keep a covered trash bin nearby': 'पास में ढका हुआ कूड़ेदान रखें',
      'Use food-grade storage containers': 'फूड-ग्रेड कंटेनर उपयोग करें',
      'Ensure proper ventilation': 'उचित वेंटिलेशन सुनिश्चित करें',
      'Wash hands before and after handling food': 'खाना संभालने से पहले और बाद में हाथ धोएं',
      'Wear clean clothes daily': 'प्रतिदिन साफ कपड़े पहनें',
      'Trim nails regularly': 'नाखून नियमित रूप से काटें',
      'Use disposable gloves when handling ready-to-eat food': 'रेडी-टू-ईट भोजन संभालते समय डिस्पोजेबल दस्ताने पहनें',
      'Use clean water for preparation': 'तैयारी के लिए साफ पानी उपयोग करें',
      'Check expiry dates on all ingredients': 'सभी सामग्री की समाप्ति तिथि जांचें',
      'Separate raw and cooked foods': 'कच्चे और पके भोजन को अलग रखें',
      'Keep food at safe temperatures': 'भोजन को सुरक्षित तापमान पर रखें',
      'of': 'में से',
      'items completed': 'आइटम पूरे',
      'Excellent': 'उत्कृष्ट',
      'Good': 'अच्छा',
      'Needs Work': 'सुधार आवश्यक',
    'Go to Promotion': 'प्रमोशन पर जाएं',

    // Promotion
    
    'Increase your online visibility and attract more customers': 'ऑनलाइन दृश्यता बढ़ाएं और अधिक ग्राहक पाएं',
    'Upload Photo': 'फोटो अपलोड करें',
    'Click to upload stall photo': 'स्टॉल फोटो अपलोड करने के लिए क्लिक करें',
    'High-quality photos of your stall and products help attract customers': 'आपकी स्टॉल और उत्पादों की उच्च गुणवत्ता वाली फोटो ग्राहक आकर्षित करती हैं',
    'Description': 'विवरण',
    'Visibility': 'दृश्यता',
    'Visible Online': 'ऑनलाइन दिखाई दे रहा है',
    'Hidden': 'छिपा हुआ',
    'Your stall is visible to customers': 'आपकी स्टॉल ग्राहकों को दिख रही है',
    'Your stall is not visible': 'आपकी स्टॉल दिखाई नहीं दे रही है',
    'Preview Card': 'पूर्वावलोकन कार्ड',
    'Preview': 'पूर्वावलोकन',
    'Location': 'स्थान',
    'Update in profile': 'प्रोफ़ाइल में अपडेट करें',
    'Avg Daily': 'औसत दैनिक',
    'Payments': 'भुगतान',
    'Configure in settings': 'सेटिंग में कॉन्फ़िगर करें',
    'View Profile': 'प्रोफ़ाइल देखें',
    'This preview is currently hidden from customers': 'यह पूर्वावलोकन वर्तमान में ग्राहकों से छिपा है',
    'Tips for Better Visibility': 'बेहतर दृश्यता के सुझाव',
    'Use clear, well-lit photos': 'स्पष्ट और प्रकाशयुक्त फोटो उपयोग करें',
    'Write honest product descriptions': 'ईमानदार उत्पाद विवरण लिखें',
    'Include your best-selling items': 'अपने सबसे अधिक बिकने वाले उत्पाद शामिल करें',
    'Enable digital payments': 'डिजिटल भुगतान सक्षम करें',
    'Maintain high hygiene score': 'उच्च स्वच्छता स्कोर बनाए रखें',
    
    'Save & Continue': 'सहेजें और जारी रखें',

    // Complaint
    'Report Bribery / Misconduct': 'रिश्वत / दुर्व्यवहार की रिपोर्ट करें',
    'Submit a confidential complaint against officials. Your identity stays protected.': 'अधिकारियों के खिलाफ गोपनीय शिकायत दर्ज करें। आपकी पहचान सुरक्षित रहेगी।',
    'Subject': 'विषय',
    
    'Preferred contact (optional)': 'पसंदीदा संपर्क (वैकल्पिक)',
    'Evidence link (optional)': 'सबूत लिंक (वैकल्पिक)',
    'Submit Complaint': 'शिकायत जमा करें',
    'E.g., Bribery request during inspection': 'उदाहरण: निरीक्षण के दौरान रिश्वत की मांग',
    'Provide details: date, place, names, what was requested, witnesses, etc.': 'विवरण दें: तारीख, स्थान, नाम, क्या मांगा गया, गवाह आदि',
    'Phone or email': 'फोन या ईमेल',
    'Link to photos/docs': 'फोटो/दस्तावेज़ का लिंक',
    'Do not include sensitive credentials. Describe the incident clearly.': 'संवेदनशील पहचान न जोड़ें। घटना स्पष्ट रूप से लिखें।',
    'Confidential': 'गोपनीय',
    'Your report is stored securely. Share only necessary details.': 'आपकी रिपोर्ट सुरक्षित रूप से संग्रहीत की जाती है। केवल आवश्यक विवरण साझा करें।',
    'Evidence': 'सबूत',
    'If you have photos/docs, provide a link. Do not upload sensitive IDs.': 'यदि आपके पास फोटो/दस्तावेज़ हैं, तो लिंक दें। संवेदनशील आईडी अपलोड न करें।',
    'Follow-up': 'अनुवर्ती',
    'We may contact you using the preferred contact you provide.': 'हम आपसे आपके द्वारा दिए गए संपर्क पर संपर्क कर सकते हैं।',
    'Complaint submitted. We will review it.': 'शिकायत जमा हो गई है। हम इसकी समीक्षा करेंगे।',
    'Subject and description are required.': 'विषय और विवरण आवश्यक हैं।',
    'Could not submit complaint. Please try again.': 'शिकायत जमा नहीं हो सकी। कृपया पुनः प्रयास करें।',

    // Admin (limited)
    'Admin Dashboard': 'एडमिन डैशबोर्ड',
    'Manage vendors and review applications': 'विक्रेताओं का प्रबंधन करें और आवेदन की समीक्षा करें',
    'Reports': 'रिपोर्ट्स',
    'Settings': 'सेटिंग्स',
  },
};

const I18nContext = createContext<I18nContextValue | undefined>(undefined);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>('en');

  useEffect(() => {
    const stored = localStorage.getItem('lang');
    if (stored === 'en' || stored === 'hi') {
      setLangState(stored);
    }
  }, []);

  const setLang = (value: Lang) => {
    setLangState(value);
    localStorage.setItem('lang', value);
  };

  const t = (key: string, fallback?: string) => {
    const dict = translations[lang] || {};
    return dict[key] ?? fallback ?? key;
  };

  const value = useMemo(() => ({ lang, setLang, t }), [lang]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used within I18nProvider');
  return ctx;
}
