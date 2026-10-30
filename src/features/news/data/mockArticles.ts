import type { NewsArticle } from '../useNews';

export const MOCK_ARTICLES: NewsArticle[] = [
  {
    id: 1,
    category: "Revolutionary Activities",
    title: "Respected Comrade Kim Jong Un Visits Major Industrial Complex",
    source: "KCNA",
    date: "April 14, Jajonsim 22 (2026)",
    isLeadership: true,
    summary:
      "The Respected Comrade Kim Jong Un provided field guidance to a recently modernized industrial complex, praising the workers for their heroic struggle in implementing the Party's decisions.",
    body: `The Respected Comrade Kim Jong Un, General Secretary of the Workers' Party of Korea and President of the State Affairs of the Democratic People's Republic of Korea, visited a major industrial complex that has been successfully modernized in the spirit of self-reliance.\n\nAccompanying him were senior officials of the Central Committee of the WPK and the provincial party committee. He was greeted at the complex by the leading officials and managers who have devoted themselves to the task of technical innovation and production growth.\n\nWalking through several production lines, he acquainted himself with the modernization of equipment and the quality of products. He expressed great satisfaction that the complex has built a solid foundation for mass-producing high-quality equipment using domestic resources and technology.\n\n"This success is a brilliant fruition of the heroic struggle of our workers who are boundlessly loyal to the Party's cause," he said, and set forth important tasks for further increasing production capacity and enhancing the competitive power of products.`,
  },
  {
    id: 2,
    category: "Politics",
    title: "Enthusiastic Celebration of National Sovereignty Held in Pyongyang",
    source: "Rodong Sinmun",
    date: "April 13, Jajonsim 22 (2026)",
    isLeadership: false,
    summary:
      "A grand assembly of citizens was held in the capital city to celebrate the achievements of national construction and renew their pledge of loyalty to the socialist cause.",
    body: `A grand assembly of working people from all walks of life was held at Kim Il Sung Square in Pyongyang to celebrate the historic achievements in national construction and the strengthening of sovereign rights.\n\nThe square was packed with crowds holding colorful flags and placards. Officials from the government and social organizations addressed the assembly, highlighting the rapid progress made in various fields of the national economy and defense under the guidance of the Workers' Party of Korea.\n\nSpeakers emphasized that the power of the DPRK lies in the single-hearted unity of the people around their leader. They called on all citizens to strive for even greater wonders in the upcoming period of the five-year plan for national economic development.\n\nThe assembly concluded with a vibrant demonstration and a pledge of loyalty, echoing with slogans of eternal struggle for the prosperity of the fatherland.`,
  },
  {
    id: 3,
    category: "Economy",
    title: "New Irrigation Systems Completed in Major Agricultural Regions",
    source: "KCNA",
    date: "April 12, Jajonsim 22 (2026)",
    isLeadership: false,
    summary:
      "Agricultural workers in South Hwanghae Province have completed the installation of new irrigation networks, ensuring stable harvests despite challenging weather conditions.",
    body: `Massive irrigation projects have been successfully completed in the vast agricultural regions of South Hwanghae Province, providing a secure foundation for another record-breaking harvest this year.\n\nThe construction workers and local farmers, through a display of the Chollima spirit, laid hundreds of kilometers of new water channels and built dozens of pumping stations in a short span of time. These systems will significantly reduce the impact of drought and ensure a steady water supply to thousands of hectares of paddy fields.\n\nThe completion of these projects is part of the national strategy to modernize agriculture and achieve complete self-sufficiency in food production. A celebration was held onsite, where medals and commendations were awarded to those who distinguished themselves during the construction.`,
  },
];

