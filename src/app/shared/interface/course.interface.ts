export interface CourseInterface {
  id: string;
  name: string;
  forAll: boolean;
  coachId: string;
  price: number;
  description: {
    text: string;
    video: string;
  };
  paid: boolean;
}
