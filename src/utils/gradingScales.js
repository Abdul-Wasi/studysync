/* src/utils/gradingScales.js */


const gradingScales = {
    IUST: {
      "B.Tech": [
        { min: 90, max: 100, grade: "O", point: 10 },
        { min: 80, max: 89.99, grade: "A", point: 9 },
        { min: 70, max: 79.99, grade: "B", point: 8 },
        { min: 60, max: 69.99, grade: "C", point: 7 },
        { min: 50, max: 59.99, grade: "D", point: 6 },
        { min: 40, max: 49.99, grade: "E", point: 5 },
        { min: 0, max: 39.99, grade: "F", point: 0 }
      ],
      "Nursing": [
        { min: 100, max: 100, grade: "O", point: 10 },
        { min: 90, max: 99.99, grade: "A+", point: 9 },
        { min: 80, max: 89.99, grade: "A", point: 8 },
        { min: 70, max: 79.99, grade: "B+", point: 7 },
        { min: 60, max: 69.99, grade: "B", point: 6 },
        { min: 50, max: 59.99, grade: "C", point: 5 },
        { min: 40, max: 49.99, grade: "P", point: 4 },
        { min: 0, max: 39.99, grade: "F", point: 0 }
      ],
      "B.Arch": [
        { min: 90, max: 100, grade: "O", point: 10 },
        { min: 80, max: 89.99, grade: "A", point: 9 },
        { min: 70, max: 79.99, grade: "B", point: 8 },
        { min: 60, max: 69.99, grade: "C", point: 7 },
        { min: 50, max: 59.99, grade: "D", point: 6 },
        { min: 45, max: 49.99, grade: "E", point: 5 },
        { min: 0, max: 44.99, grade: "F", point: 0 }
      ],
      "Ph.D": [
        { min: 90, max: 100, grade: "O", point: 10 },
        { min: 80, max: 89.99, grade: "A", point: 9 },
        { min: 70, max: 79.99, grade: "B", point: 8 },
        { min: 65, max: 69.99, grade: "C", point: 7 },
        { min: 60, max: 64.99, grade: "D", point: 6 },
        { min: 55, max: 59.99, grade: "E", point: 5 },
        { min: 0, max: 54.99, grade: "F", point: 0 }
      ],
      "Others": [
        { min: 90, max: 100, grade: "O", point: 10 },
        { min: 80, max: 89.99, grade: "A", point: 9 },
        { min: 70, max: 79.99, grade: "B", point: 8 },
        { min: 60, max: 69.99, grade: "C", point: 7 },
        { min: 50, max: 59.99, grade: "D", point: 6 },
        { min: 40, max: 49.99, grade: "E", point: 5 },
        { min: 0, max: 39.99, grade: "F", point: 0 }
      ]
    }
  };
  
  export default gradingScales;
  