// User Profile Type Definition
type UserProfile = {
  // Basic Info (Essential)
  username: string,
  fullName: string,
  profilePhoto: string,
  bio: string,

  // Location
  location: {
    country: string,
    city: string,
  },

  // Travel Preferences
  preferences: {
    // Types of places they prefer
    placeTypes: string[], // ["Beach", "Mountain", "City", "Historical", "Nature"]
    
    // Travel style/budget
    travelStyle: string[], // ["Luxury", "Budget", "Adventure", "Relaxation"]
    
    // Activities they're interested in
    activities: string[], // ["Photography", "Hiking", "Food", "Culture", "Shopping"]
    
    // Accommodation preferences
    accommodation: string[], // ["Hotel", "Hostel", "Resort", "Camping"]
  },

  // User's Places/Photos Collection
  places: {
    id: string,
    title: string,
    description: string,
    location: {
      country: string,
      city: string,
      coordinates: {
        latitude: number,
        longitude: number
      }
    },
    photos: Array<{
      id: string,
      url: string,
      caption: string,
      takenAt: Date,
      isPublic: boolean,  // Privacy setting per photo
      tags: string[]
    }>,
    category: string[],  // ["Beach", "Mountain", etc.]
    rating: number,
    visitDate: Date,
    isPublic: boolean,  // Privacy setting for the whole place
    createdAt: Date,
    updatedAt: Date
  }[],

  // Social Links (Optional)
  social: {
    instagram: string,
    twitter: string,
    facebook: string
  },

  // Privacy & Communication Settings
  settings: {
    emailNotifications: boolean,
    language: string,
    currency: string,
    privacy: {
      defaultPhotoPrivacy: boolean,  // Default privacy for new uploads
      profileVisibility: 'public' | 'private' | 'friends',
      showLocation: boolean,
      showVisitedPlaces: boolean
    }
  },

  // Stats
  stats: {
    totalPlaces: number,
    totalPhotos: number,
    totalPublicPlaces: number,
    totalPrivatePlaces: number,
    joinedDate: Date,
    lastActive: Date
  }
};

// Place Type Definition
type Place = {
  id: string,
  userId: string,
  title: string,
  description: string,
  location: {
    country: string,
    city: string,
    coordinates: {
      latitude: number,
      longitude: number
    },
    address: string
  },
  photos: Array<{
    id: string,
    url: string,
    caption: string,
    takenAt: Date,
    isPublic: boolean,
    tags: string[]
  }>,
  category: string[],
  rating: number,
  visitDate: Date,
  isPublic: boolean,
  likes: number,
  comments: Array<{
    id: string,
    userId: string,
    text: string,
    createdAt: Date
  }>,
  createdAt: Date,
  updatedAt: Date
}; 