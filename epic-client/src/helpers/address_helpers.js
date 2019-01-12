import {INVALID_POSTCODE} from "./error";

export const countries = [{ value: "AF", name: "Afghanistan" }, {
    value: "AX",
    name: "Åland Islands"
}, { value: "AL", name: "Albania" }, { value: "DZ", name: "Algeria" }, {
    value: "AS",
    name: "American Samoa"
}, { value: "AD", name: "Andorra" }, { value: "AO", name: "Angola" }, {
    value: "AI",
    name: "Anguilla"
}, { value: "AQ", name: "Antarctica" }, { value: "AG", name: "Antigua and Barbuda" }, {
    value: "AR",
    name: "Argentina"
}, { value: "AM", name: "Armenia" }, { value: "AW", name: "Aruba" }, {
    value: "AU",
    name: "Australia"
}, { value: "AT", name: "Austria" }, { value: "AZ", name: "Azerbaijan" }, {
    value: "BS",
    name: "Bahamas"
}, { value: "BH", name: "Bahrain" }, { value: "BD", name: "Bangladesh" }, {
    value: "BB",
    name: "Barbados"
}, { value: "BY", name: "Belarus" }, { value: "BE", name: "Belgium" }, {
    value: "BZ",
    name: "Belize"
}, { value: "BJ", name: "Benin" }, { value: "BM", name: "Bermuda" }, {
    value: "BT",
    name: "Bhutan"
}, { value: "BO", name: "Bolivia, Plurinational State of" }, {
    value: "BQ",
    name: "Bonaire, Sint Eustatius and Saba"
}, { value: "BA", name: "Bosnia and Herzegovina" }, { value: "BW", name: "Botswana" }, {
    value: "BV",
    name: "Bouvet Island"
}, { value: "BR", name: "Brazil" }, { value: "IO", name: "British Indian Ocean Territory" }, {
    value: "BN",
    name: "Brunei Darussalam"
}, { value: "BG", name: "Bulgaria" }, { value: "BF", name: "Burkina Faso" }, {
    value: "BI",
    name: "Burundi"
}, { value: "KH", name: "Cambodia" }, { value: "CM", name: "Cameroon" }, {
    value: "CA",
    name: "Canada"
}, { value: "CV", name: "Cape Verde" }, { value: "KY", name: "Cayman Islands" }, {
    value: "CF",
    name: "Central African Republic"
}, { value: "TD", name: "Chad" }, { value: "CL", name: "Chile" }, {
    value: "CN",
    name: "China"
}, { value: "CX", name: "Christmas Island" }, { value: "CC", name: "Cocos (Keeling) Islands" }, {
    value: "CO",
    name: "Colombia"
}, { value: "KM", name: "Comoros" }, { value: "CG", name: "Congo" }, {
    value: "CD",
    name: "Congo, the Democratic Republic of the"
}, { value: "CK", name: "Cook Islands" }, { value: "CR", name: "Costa Rica" }, {
    value: "CI",
    name: "C\u00f4te d'Ivoire"
}, { value: "HR", name: "Croatia" }, { value: "CU", name: "Cuba" }, {
    value: "CW",
    name: "Cura\u00e7ao"
}, { value: "CY", name: "Cyprus" }, { value: "CZ", name: "Czech Republic" }, {
    value: "DK",
    name: "Denmark"
}, { value: "DJ", name: "Djibouti" }, { value: "DM", name: "Dominica" }, {
    value: "DO",
    name: "Dominican Republic"
}, { value: "EC", name: "Ecuador" }, { value: "EG", name: "Egypt" }, {
    value: "SV",
    name: "El Salvador"
}, { value: "GQ", name: "Equatorial Guinea" }, { value: "ER", name: "Eritrea" }, {
    value: "EE",
    name: "Estonia"
}, { value: "ET", name: "Ethiopia" }, { value: "FK", name: "Falkland Islands (Malvinas)" }, {
    value: "FO",
    name: "Faroe Islands"
}, { value: "FJ", name: "Fiji" }, { value: "FI", name: "Finland" }, {
    value: "FR",
    name: "France"
}, { value: "GF", name: "French Guiana" }, { value: "PF", name: "French Polynesia" }, {
    value: "TF",
    name: "French Southern Territories"
}, { value: "GA", name: "Gabon" }, { value: "GM", name: "Gambia" }, {
    value: "GE",
    name: "Georgia"
}, { value: "DE", name: "Germany" }, { value: "GH", name: "Ghana" }, {
    value: "GI",
    name: "Gibraltar"
}, { value: "GR", name: "Greece" }, { value: "GL", name: "Greenland" }, {
    value: "GD",
    name: "Grenada"
}, { value: "GP", name: "Guadeloupe" }, { value: "GU", name: "Guam" }, {
    value: "GT",
    name: "Guatemala"
}, { value: "GG", name: "Guernsey" }, { value: "GN", name: "Guinea" }, {
    value: "GW",
    name: "Guinea-Bissau"
}, { value: "GY", name: "Guyana" }, { value: "HT", name: "Haiti" }, {
    value: "HM",
    name: "Heard Island and McDonald Islands"
}, { value: "VA", name: "Holy See (Vatican City State)" }, { value: "HN", name: "Honduras" }, {
    value: "HK",
    name: "Hong Kong"
}, { value: "HU", name: "Hungary" }, { value: "IS", name: "Iceland" }, {
    value: "IN",
    name: "India"
}, { value: "ID", name: "Indonesia" }, { value: "IR", name: "Iran, Islamic Republic of" }, {
    value: "IQ",
    name: "Iraq"
}, { value: "IE", name: "Ireland" }, { value: "IM", name: "Isle of Man" }, {
    value: "IL",
    name: "Israel"
}, { value: "IT", name: "Italy" }, { value: "JM", name: "Jamaica" }, {
    value: "JP",
    name: "Japan"
}, { value: "JE", name: "Jersey" }, { value: "JO", name: "Jordan" }, {
    value: "KZ",
    name: "Kazakhstan"
}, { value: "KE", name: "Kenya" }, { value: "KI", name: "Kiribati" }, {
    value: "KP",
    name: "Korea, Democratic People's Republic of"
}, { value: "KR", name: "Korea, Republic of" }, { value: "KW", name: "Kuwait" }, {
    value: "KG",
    name: "Kyrgyzstan"
}, { value: "LA", name: "Lao People's Democratic Republic" }, { value: "LV", name: "Latvia" }, {
    value: "LB",
    name: "Lebanon"
}, { value: "LS", name: "Lesotho" }, { value: "LR", name: "Liberia" }, {
    value: "LY",
    name: "Libya"
}, { value: "LI", name: "Liechtenstein" }, { value: "LT", name: "Lithuania" }, {
    value: "LU",
    name: "Luxembourg"
}, { value: "MO", name: "Macao" }, {
    value: "MK",
    name: "Macedonia, the Former Yugoslav Republic of"
}, { value: "MG", name: "Madagascar" }, { value: "MW", name: "Malawi" }, {
    value: "MY",
    name: "Malaysia"
}, { value: "MV", name: "Maldives" }, { value: "ML", name: "Mali" }, {
    value: "MT",
    name: "Malta"
}, { value: "MH", name: "Marshall Islands" }, { value: "MQ", name: "Martinique" }, {
    value: "MR",
    name: "Mauritania"
}, { value: "MU", name: "Mauritius" }, { value: "YT", name: "Mayotte" }, {
    value: "MX",
    name: "Mexico"
}, { value: "FM", name: "Micronesia, Federated States of" }, {
    value: "MD",
    name: "Moldova, Republic of"
}, { value: "MC", name: "Monaco" }, { value: "MN", name: "Mongolia" }, {
    value: "ME",
    name: "Montenegro"
}, { value: "MS", name: "Montserrat" }, { value: "MA", name: "Morocco" }, {
    value: "MZ",
    name: "Mozambique"
}, { value: "MM", name: "Myanmar" }, { value: "NA", name: "Namibia" }, {
    value: "NR",
    name: "Nauru"
}, { value: "NP", name: "Nepal" }, { value: "NL", name: "Netherlands" }, {
    value: "NC",
    name: "New Caledonia"
}, { value: "NZ", name: "New Zealand" }, { value: "NI", name: "Nicaragua" }, {
    value: "NE",
    name: "Niger"
}, { value: "NG", name: "Nigeria" }, { value: "NU", name: "Niue" }, {
    value: "NF",
    name: "Norfolk Island"
}, { value: "MP", name: "Northern Mariana Islands" }, { value: "NO", name: "Norway" }, {
    value: "OM",
    name: "Oman"
}, { value: "PK", name: "Pakistan" }, { value: "PW", name: "Palau" }, {
    value: "PS",
    name: "Palestine, State of"
}, { value: "PA", name: "Panama" }, { value: "PG", name: "Papua New Guinea" }, {
    value: "PY",
    name: "Paraguay"
}, { value: "PE", name: "Peru" }, { value: "PH", name: "Philippines" }, {
    value: "PN",
    name: "Pitcairn"
}, { value: "PL", name: "Poland" }, { value: "PT", name: "Portugal" }, {
    value: "PR",
    name: "Puerto Rico"
}, { value: "QA", name: "Qatar" }, { value: "RE", name: "R\u00e9union" }, {
    value: "RO",
    name: "Romania"
}, { value: "RU", name: "Russian Federation" }, { value: "RW", name: "Rwanda" }, {
    value: "BL",
    name: "Saint Barth\u00e9lemy"
}, { value: "SH", name: "Saint Helena, Ascension and Tristan da Cunha" }, {
    value: "KN",
    name: "Saint Kitts and Nevis"
}, { value: "LC", name: "Saint Lucia" }, { value: "MF", name: "Saint Martin (French part)" }, {
    value: "PM",
    name: "Saint Pierre and Miquelon"
}, { value: "VC", name: "Saint Vincent and the Grenadines" }, { value: "WS", name: "Samoa" }, {
    value: "SM",
    name: "San Marino"
}, { value: "ST", name: "Sao Tome and Principe" }, { value: "SA", name: "Saudi Arabia" }, {
    value: "SN",
    name: "Senegal"
}, { value: "RS", name: "Serbia" }, { value: "SC", name: "Seychelles" }, {
    value: "SL",
    name: "Sierra Leone"
}, { value: "SG", name: "Singapore" }, { value: "SX", name: "Sint Maarten (Dutch part)" }, {
    value: "SK",
    name: "Slovakia"
}, { value: "SI", name: "Slovenia" }, { value: "SB", name: "Solomon Islands" }, {
    value: "SO",
    name: "Somalia"
}, { value: "ZA", name: "South Africa" }, {
    value: "GS",
    name: "South Georgia and the South Sandwich Islands"
}, { value: "SS", name: "South Sudan" }, { value: "ES", name: "Spain" }, {
    value: "LK",
    name: "Sri Lanka"
}, { value: "SD", name: "Sudan" }, { value: "SR", name: "Suriname" }, {
    value: "SJ",
    name: "Svalbard and Jan Mayen"
}, { value: "SZ", name: "Swaziland" }, { value: "SE", name: "Sweden" }, {
    value: "CH",
    name: "Switzerland"
}, { value: "SY", name: "Syrian Arab Republic" }, {
    value: "TW",
    name: "Taiwan, Province of China"
}, { value: "TJ", name: "Tajikistan" }, { value: "TZ", name: "Tanzania, United Republic of" }, {
    value: "TH",
    name: "Thailand"
}, { value: "TL", name: "Timor-Leste" }, { value: "TG", name: "Togo" }, {
    value: "TK",
    name: "Tokelau"
}, { value: "TO", name: "Tonga" }, { value: "TT", name: "Trinidad and Tobago" }, {
    value: "TN",
    name: "Tunisia"
}, { value: "TR", name: "Turkey" }, { value: "TM", name: "Turkmenistan" }, {
    value: "TC",
    name: "Turks and Caicos Islands"
}, { value: "TV", name: "Tuvalu" }, { value: "UG", name: "Uganda" }, {
    value: "UA",
    name: "Ukraine"
}, { value: "AE", name: "United Arab Emirates" },
    { value: "GB", name: "United Kingdom", isDefault: true}, {
    value: "US",
    name: "United States"
}, { value: "UM", name: "United States Minor Outlying Islands" }, {
    value: "UY",
    name: "Uruguay"
}, { value: "UZ", name: "Uzbekistan" }, { value: "VU", name: "Vanuatu" }, {
    value: "VE",
    name: "Venezuela, Bolivarian Republic of"
}, { value: "VN", name: "Viet Nam" }, { value: "VG", name: "Virgin Islands, British" }, {
    value: "VI",
    name: "Virgin Islands, U.S."
}, { value: "WF", name: "Wallis and Futuna" }, { value: "EH", name: "Western Sahara" }, {
    value: "YE",
    name: "Yemen"
}, { value: "ZM", name: "Zambia" }, { value: "ZW", name: "Zimbabwe" }]

const postCodeRules = [
    { countryCode: 'AT', regex: '^(\d{4})$', display: 'NNNN' },
    { countryCode: 'AU', regex: '^(\d{4})$', display: 'NNNN' },
    { countryCode: 'BE', regex: '^(\d{4})$', display: 'NNNN' },
    { countryCode: 'BG', regex: '^(\d{4})$', display: 'NNNN' },
    { countryCode: 'CA', regex: '^(?:[A-Za-z]\d[A-Z]\s\d[A-Z]\d)$', display: 'ANA NAN' },
    { countryCode: 'CH', regex: '^(\d{4})$', display: 'NNNN' },
    { countryCode: 'CY', regex: '^(\d{4})$', display: 'NNNN' },
    { countryCode: 'CZ', regex: '^(\d{3}\s\d{2})$', display: 'NNN NN' },
    { countryCode: 'DE', regex: '^(\d{5})$', display: 'NNNNN' },
    { countryCode: 'DK', regex: '^(\d{4})$', display: 'NNNN' },
    { countryCode: 'EE', regex: '^(\d{5})$', display: 'NNNNN' },
    { countryCode: 'ES', regex: '^(\d{5})$', display: 'NNNNN' },
    { countryCode: 'FI', regex: '^(\d{5})$', display: 'NNNNN' },
    { countryCode: 'FR', regex: '^(\d{5})$', display: 'NNNNN' },
    {
        countryCode: 'GB',
        regex: '^([A-Z](([0-9][0-9]?)|([A-Z][0-9][0-9]?)|([A-Z]?[0-9][A-Z])) ?[0-9][ABD-HJLNP-UW-Z]{2})$',
        display: 'CCNN NCC'
    },
    { countryCode: 'GR', regex: '^(\d{3}\s\d{2})$', display: 'NNNNN or NNN NN' },
    { countryCode: 'HU', regex: '^(\d{4})$', display: 'NNNN' },
    { countryCode: 'IT', regex: '^(\d{5})$', display: 'NNNNN' },
    { countryCode: 'KR', regex: '^(\d{5})$', display: 'NNNNN' },
    { countryCode: 'LT', regex: '^(\d{5})$', display: 'NNNNN' },
    { countryCode: 'LU', regex: '^(\d{4})$', display: 'NNNN' },
    { countryCode: 'LV', regex: '^((?i)LV-\d{4})$', display: 'NNNN or CC-NNNN' },
    { countryCode: 'MT', regex: '^(?:[A-Z]{3}\s\d{4})$', display: 'AAA NNNN' },
    { countryCode: 'MY', regex: '^(\d{5})$', display: 'NNNNN' },
    { countryCode: 'NO', regex: '^(\d{4})$', display: 'NNNN' },
    { countryCode: 'NZ', regex: '^(\d{4})$', display: 'NNNN' },
    { countryCode: 'PH', regex: '^(\d{4})$', display: 'NNNN' },
    { countryCode: 'PL', regex: '^(\d{2}-\d{3})$', display: 'NN-NNN' },
    { countryCode: 'PT', regex: '^(\d{4}-\d{3})$', display: 'NNNN-NNN' },
    { countryCode: 'RO', regex: '^(\d{6})$', display: 'NNNNNN' },
    { countryCode: 'SE', regex: '^(?:\d{3}\s\d{2})$', display: 'NNNNN or NNNN' },
    { countryCode: 'SG', regex: '^(\d{6})$', display: 'NNNNNN' },
    { countryCode: 'SI', regex: '^(?:\d{4})$', display: 'NNN NN' },
    { countryCode: 'SK', regex: '^(\d{3}\s\d{2})$', display: 'NNN NN' },
    { countryCode: 'US', regex: '^(\d{5}-\d{4})$|^(\d{5})$', display: 'NNNNN-NNNN or NNNNN' },
    { countryCode: 'ZA', regex: '^(\d{4})$', display: 'NNNN' }
];
export const validatePostcodeAndReturnError = (postcode, model = {}) => {
    let error;
    const postcodeRule = postCodeRules.filter(rule => rule.countryCode === model.country);
    if (postcodeRule[0]) {
        const OK = RegExp(postcodeRule[0].regex).exec(postcode);
        if (!OK) error = INVALID_POSTCODE + postcodeRule[0].display;
    }
    return error;
};
// TODO address validation