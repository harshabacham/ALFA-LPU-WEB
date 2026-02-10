
export interface Notification {
  id: string;
  title: string;
  description: string;
  category: string;
  media_url: string;
  type: string;
  timestamp: string;
}

export interface Club {
  id: string;
  logo_link: string;
  name: string;
  description: string;
  category: string;
  form_link: string;
  contact_info: string;
  meeting_times: string;
}

export interface Event {
  image_url: string;
  title: string;
  description: string;
  link: string;
  date: string;
  time: string;
  venue: string;
  price: string;
  organizer: string;
}

export interface PGRoom {
  name: string;
  address: string;
  rent: string;
  kitchen_security_ac: string; // This column contains contact numbers in the CSV
  amenities: string;
  image_urls: string;
  video_urls: string;
  location_url: string;
  description: string;
  pg_type: string;
  rating: string;
  total_capacity: string;
  current_occupancy: string;
  is_looking_for_roommate: string;
  roommate_message: string;
  roommate_preferences: string;
  move_in_date: string;
  roommate_contact_number: string;
}

export interface DutyLeave {
  date: string;
  title: string;
  description: string;
  venue: string;
  time: string;
}

export interface Note {
  subject: string;
  name: string;
  file_id: string;
}

export interface Course {
  image_url: string;
  title: string;
  description: string;
  category: string;
  course_url: string;
}

export interface Deal {
  id: string;
  title: string;
  description: string;
  price: string;
  contact: string;
  image_url: string;
  category: string;
  tags: string;
  rating: string;
  location: string;
  condition: string;
  seller_name: string;
}

export interface AITool {
  tool_name: string;
  description: string;
  category: string;
  logo_url: string;
  tool_url: string;
}

export interface YouTubeChannel {
  category: string;
  subject: string;
  title: string;
  url: string;
}
