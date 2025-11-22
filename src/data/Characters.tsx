import countryMexico from '/assets/flags/México.jpeg'
import countryUSA from '/assets/flags/Estados Unidos.jpeg'
import countryBrazil from '/assets/flags/Brasil.jpeg'
import countryCanada from '/assets/flags/Canadá.jpeg'
import countryJordan from '/assets/flags/Jordania.jpeg'
import countrySouthKorea from '/assets/flags/Sur Corea.jpeg'

// --- DATOS DE PERSONAJES ---
export interface CharacterData {
  id: number;
  name: string;
  country: string;
  skinKey: string;
  flagImg: string;
  faceImg: string;
  price: number;
}

export const Characters: CharacterData[] = [
  { id: 1, name: "Santiago Giménez", country: "México", skinKey: "Santi", flagImg: countryMexico, faceImg: "/assets/heads/mexico.png", price: 0 },
  { id: 2, name: "Gio Reyna", country: "USA", skinKey: "Gio", flagImg: countryUSA, faceImg: "/assets/heads/usa.png", price: 50 }, 
  { id: 3, name: "Alphonso Davies", country: "Canadá", skinKey: "Gio", flagImg: countryCanada, faceImg: "/img/character.png", price: 100 },
  { id: 4, name: "Endrick Siap", country: "Brasil", skinKey: "Santi", flagImg: countryBrazil, faceImg: "/img/character.png", price: 200 }, // Placeholder (usa skin Santi)
  { id: 5, name: "Musa Al-Taamari", country: "Jordania", skinKey: "Gio", flagImg: countryJordan, faceImg: "/img/character.png", price: 150 }, // Placeholder
  { id: 6, name: "Cho Gue-Sung", country: "Corea del Sur", skinKey: "Santi", flagImg: countrySouthKorea, faceImg: "/img/character.png", price: 120 } // Placeholder
];