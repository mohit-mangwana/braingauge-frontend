
import client from "./client";

//  AUTH

export const authAPI = {
  
  register: (data) =>
    client.post("/auth/register", data).then((r) => r.data),


  login: (email, password) =>
    client.post("/auth/login", { email, password }).then((r) => r.data),

 
  getMe: () =>
    client.get("/auth/me").then((r) => r.data),


  updateProfile: (updates) =>
    client.put("/auth/profile", updates).then((r) => r.data),

 
  changePassword: (currentPassword, newPassword) =>
    client
      .put("/auth/change-password", { currentPassword, newPassword })
      .then((r) => r.data),
};


//  DASHBOARD

export const dashboardAPI = {
 
  getData: () =>
    client.get("/dashboard").then((r) => r.data),
};


//  NOTIFICATIONS

export const notifAPI = {

  getAll: () =>
    client.get("/notifications").then((r) => r.data),

  markRead: (id) =>
    client.put(`/notifications/${id}/read`).then((r) => r.data),


  markAllRead: () =>
    client.put("/notifications/read-all").then((r) => r.data),
};


//  QUIZZES

export const quizAPI = {
 
  list: (params = {}) =>
    client.get("/quizzes", { params }).then((r) => r.data),

  
  getBySubject: (subject) =>
    client.get(`/quizzes/subject/${subject}`).then((r) => r.data),


  getForAttempt: (quizId) =>
    client.get(`/quizzes/${quizId}/attempt`).then((r) => r.data),

 
  leaderboard: (quizId) =>
    client.get(`/quizzes/${quizId}/leaderboard`).then((r) => r.data),

 
  history: (params = {}) =>
    client.get("/quizzes/history", { params }).then((r) => r.data),
};


//  QUIZ PARTICIPATION  (session lifecycle)

// export const participationAPI = {
  
//   start: (quizId) =>
//     client.post(`/quiz/${quizId}/start`).then((r) => r.data),


//   recordAnswer: (quizId, sessionId, questionId, selectedOption, timeTakenSecs) =>
//     client
//       .post(`/quiz/${quizId}/answer`, {
//         sessionId, questionId, selectedOption, timeTakenSecs,
//       })
//       .then((r) => r.data),


//   submit: (quizId, sessionId, answers) =>
//     client
//       .post(`/quiz/${quizId}/submit`, { sessionId, answers })
//       .then((r) => r.data),


//   timeout: (quizId, sessionId) =>
//     client.post(`/quiz/${quizId}/timeout`, { sessionId }).then((r) => r.data),

//   history: (params = {}) =>
//     client.get("/quiz/history", { params }).then((r) => r.data),


//   getScore: (scoreId) =>
//     client.get(`/quiz/scores/${scoreId}`).then((r) => r.data),
// };

export const teacherAPI = {
  /** GET /teacher/dashboard */
  getDashboard: () =>
    client.get("/teacher/dashboard").then((r) => r.data),
 
  /** GET /teacher/students */
  getStudents: (params = {}) =>
    client.get("/teacher/students", { params }).then((r) => r.data),
 
  /** GET /teacher/students/:id */
  getStudentDetail: (id) =>
    client.get(`/teacher/students/${id}`).then((r) => r.data),
 
  /** GET /teacher/quizzes/:quizId/results */
  getQuizResults: (quizId, params = {}) =>
    client.get(`/teacher/quizzes/${quizId}/results`, { params }).then((r) => r.data),
 
  /** GET /teacher/questions */
  listQuestions: (params = {}) =>
    client.get("/teacher/questions", { params }).then((r) => r.data),
 
  /** GET /teacher/questions/analytics */
  getQuestionAnalytics: () =>
    client.get("/teacher/questions/analytics").then((r) => r.data),
 
  /** POST /teacher/questions */
  addQuestion: (data) =>
    client.post("/teacher/questions", data).then((r) => r.data),
 
  /** PUT /teacher/questions/:id */
  editQuestion: (id, data) =>
    client.put(`/teacher/questions/${id}`, data).then((r) => r.data),
 
  /** DELETE /teacher/questions/:id */
  deleteQuestion: (id) =>
    client.delete(`/teacher/questions/${id}`).then((r) => r.data),
};

export const participationAPI = {
  /** POST /quiz/:id/start → { sessionId } */
  start: (quizId) =>
    client.post(`/quiz/${quizId}/start`).then((r) => r.data),
 
  /** POST /quiz/:id/answer  (single answer during quiz) */
  recordAnswer: (quizId, sessionId, questionId, selectedOption, timeTakenSecs) =>
    client
      .post(`/quiz/${quizId}/answer`, {
        sessionId, questionId, selectedOption, timeTakenSecs,
      })
      .then((r) => r.data),
 
  /** POST /quiz/:id/submit → full graded result */
  submit: (quizId, sessionId, answers) =>
    client
      .post(`/quiz/${quizId}/submit`, { sessionId, answers })
      .then((r) => r.data),
 
  /** POST /quiz/:id/timeout */
  timeout: (quizId, sessionId) =>
    client.post(`/quiz/${quizId}/timeout`, { sessionId }).then((r) => r.data),
 
  /** GET /quiz/history */
  history: (params = {}) =>
    client.get("/quiz/history", { params }).then((r) => r.data),
 
  /** GET /quiz/scores/:scoreId */
  getScore: (scoreId) =>
    client.get(`/quiz/scores/${scoreId}`).then((r) => r.data),
};
