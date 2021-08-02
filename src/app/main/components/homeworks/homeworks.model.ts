export class HomeworksModel {
  id: string;
  students: [{id: string, name: string}];
  title: string;
  description: string;
  example: string;
  createdDate: Date;
  createdBy?: {
    id: string;
    name: string;
  };
  likes: [];
  constructor(obj) {
    this.id = obj._id;
    this.students = obj.students.map(st => ({id: st.id, name: st.name}));
    this.title = obj.title;
    this.description = obj.description;
    this.example = obj.example;
    this.createdDate = obj.createdDate;
    this.createdBy = obj.createdBy;
    this.likes = obj.likes;
  }
}
