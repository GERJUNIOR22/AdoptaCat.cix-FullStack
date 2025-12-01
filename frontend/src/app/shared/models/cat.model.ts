export interface Cat {
  id: string;
  name: string;
  age?: number | string;
  edadMeses?: number;
  breed?: string;
  image?: string;
  mainImageUrl?: string;
  gallery?: string[];
  personality?: string | string[];
  story?: string;
  description?: string;
  isSpecialNeeds?: boolean;
  vaccinated?: boolean;
  sterilized?: boolean;
  isVaccinated?: boolean;
  isSterilized?: boolean;
  gender?: 'male' | 'female' | 'MALE' | 'FEMALE';
}

export interface DetailedCat extends Cat {
  mainImage: string;
  gallery: string[];
  personality: string[];
  story: string;
  description: string;
  characteristics: {
    birthDate: string;
    gender: string;
    size: string;
    activityLevel: string;
    healthStatus: string;
    arrivedAt: string;
  };
  adoptionProcess: Array<{
    step: number;
    title: string;
    description: string;
    color: string;
  }>;
}