const courses = [
  {
    subject: 'CSE',
    number: 110,
    title: 'Introduction to Programming',
    credits: 3,
    certificate: 'Web and Computer Programming',
    desc: 'This course will introduce students to programming and problem solving techniques.',
    completed: true
  },
  {
    subject: 'CSE',
    number: 111,
    title: 'Programming Building Function',
    credits: 3,
    certificate: 'Web and Computer Programming',
    desc: 'This course will introduce students to programming and problem solving techniques.',
    completed: true
  },
  {
    subject: 'CSE',
    number: 210,
    title: 'Programming with Classes',
    credits: 3,
    certificate: 'Web and Computer Programming',
    desc: 'This course will introduce the notion of classes and object-oriented concepts.',
    completed: true
  },
  {
    subject: 'WDD',
    number: 130,
    title: 'Web Fundamentals',
    credits: 2,
    certificate: 'Web and Computer Programming',
    desc: 'This course introduces students to the World Wide Web and basic HTML and CSS.',
    completed: true
  },
  {
    subject: 'WDD',
    number: 131,
    title: 'Dynamic Web Fundamentals',
    credits: 2,
    certificate: 'Web and Computer Programming',
    desc: 'This course builds on prior experience in Web Fundamentals.',
    completed: true
  },
  {
    subject: 'WDD',
    number: 231,
    title: 'Frontend Web Development',
    credits: 2,
    certificate: 'Web and Computer Programming',
    desc: 'This course continues the work done in Web Fundamentals.',
    completed: false
  },
  {
    subject: 'CSE',
    number: 212,
    title: 'Mobile Application Development',
    credits: 3,
    certificate: 'Web and Computer Programming',
    desc: 'This course builds on the programming with classes knowledge to develop mobile applications.',
    completed: false
  }
];

document.addEventListener('DOMContentLoaded', function() {
  const coursesContainer = document.getElementById('courses-container');
  const allBtn = document.getElementById('all-btn');
  const wddBtn = document.getElementById('wdd-btn');
  const cseBtn = document.getElementById('cse-btn');
  const totalCreditsEl = document.getElementById('total-credits');

  function displayCourses(filteredCourses) {
    coursesContainer.innerHTML = '';
    filteredCourses.forEach(course => {
      const card = document.createElement('div');
      card.className = `course-card ${course.completed ? 'completed' : ''}`;
      card.innerHTML = `
        <h3>${course.subject} ${course.number}</h3>
        <p>${course.title}</p>
        <p><strong>Credits:</strong> ${course.credits}</p>
        <p><strong>Certificate:</strong> ${course.certificate}</p>
        <p>${course.desc}</p>
      `;
      coursesContainer.appendChild(card);
    });

    const totalCredits = filteredCourses.reduce((sum, course) => sum + course.credits, 0);
    totalCreditsEl.textContent = `Total Credits: ${totalCredits}`;
  }

  allBtn.addEventListener('click', function() {
    displayCourses(courses);
    setActiveButton(allBtn);
  });

  wddBtn.addEventListener('click', function() {
    const wddCourses = courses.filter(course => course.subject === 'WDD');
    displayCourses(wddCourses);
    setActiveButton(wddBtn);
  });

  cseBtn.addEventListener('click', function() {
    const cseCourses = courses.filter(course => course.subject === 'CSE');
    displayCourses(cseCourses);
    setActiveButton(cseBtn);
  });

  function setActiveButton(activeBtn) {
    [allBtn, wddBtn, cseBtn].forEach(btn => btn.classList.remove('active'));
    activeBtn.classList.add('active');
  }

  displayCourses(courses);
  allBtn.classList.add('active');
});