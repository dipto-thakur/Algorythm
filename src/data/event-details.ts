import type { EventDetails } from "@/types/site";

export const eventDetails: Record<string, EventDetails> = {
  codesclash: {
    tagline: "Think. Code. Compete. Create.",
about: [
  "CodesClash is a college-level coding competition where students collaborate in teams to solve problems and build innovative projects within a limited time.",
  "Participants can compete across four tracks: Frontend Development, Fullstack Development, and AI/ML.",
  "The event encourages creativity, problem-solving, teamwork, and practical application of technical skills, with AI tools permitted according to the event guidelines.",
  "Every team must select one track: Frontend, Fullstack, or AI/ML.",
  "All team members should contribute to the project and understand its implementation.",
  "Teams must submit their project within the deadline and be ready for the final presentation.",
],
whatsappGroup: "https://chat.whatsapp.com/KQhydgW4m5i26p7w1jqPOV?s=cl&p=a&mlu=4&ilr=4&iam=2",

    // poster: "https://drive.google.com/file/d/XXXX/view",
    brochure: "https://drive.google.com/file/d/1v3PM40Q818tAOioJ_B7QLC_842hM2vqF/view?usp=sharing",
    team: {
        size: "1-4 members",
        eligibility: [
          "Students from all departments",
          "Each participant can belong to only one team."
        ],
        notes: [
          "Teams must work collaboratively to complete their project within 3 hours.",
          "If the number of registered teams exceeds 15, a qualifying round may be conducted within two days after registration closes."
        ]
      },
    // prizes: [{ place: "1st", reward: "..." }],
rules: [
  "Participants must compete in registered teams.",
  "The total project development time is 3 hours.",
  "Each team must choose a designated track: Frontend, Fullstack, or AI/ML.",
  "AI tools may be used according to the permissions announced by the organizers.",
  "Teams must develop and present their own project within the allotted time.",
  "Projects must be relevant to the selected track and demonstrate practical functionality.",
  "Teams must be prepared to explain their code, implementation, and design decisions.",
  "Judging will consider functionality, innovation, technical implementation, problem-solving, and presentation.",
  "Participants must not copy another team's project or misrepresent existing work as their own.",
  "The judges' decision will be final."
],
contacts: [
  {
    name: "Shuvam",
    role: "Coordinator",
    phone: "+91 8240554940"
  }
],
  },
  canvaclash: {
    tagline:
      "Design. Create. Compete.",
    about: [
      "Canva Clash is an individual design challenge that tests your ability to turn a given brief into a visually compelling and effective design. Bring your ideas to life through thoughtful composition, creative execution and strong visual communication.",
      "Participation: Individual participation only. Team entries are not permitted.",
      "Design Platform: Canva must be the primary and exclusive design platform used throughout the challenge.",
      "Fair Play: AI tools and external design or generative tools outside Canva are strictly prohibited. All submitted work must be your own original creation.",
    ],
    whatsappGroup: "https://chat.whatsapp.com/JwcY3a4MaCW51TPHIstiId?s=cl&p=a&mlu=4&ilr=4&iam=2",
    // poster: "https://drive.google.com/file/d/XXXX/view",
    // brochure: "https://drive.google.com/file/d/XXXX/view",
    rules: [
      "Participation is strictly individual. No team submissions are allowed.",
      "Canva must be the only design platform used to create the final submission.",
      "The use of AI tools or external design, editing or generative tools outside Canva is strictly prohibited.",
      "Participants must create original work and must not copy or reproduce another person's design.",
      "Submissions must address the given brief and follow the instructions provided by the organisers.",
      "Organisers' decisions regarding rule violations and disqualification will be final.",
    ],
    // prizes: [{ place: "1st", reward: "..." }],
    team: {
        size: "1 member",
        eligibility: [
          "Students from all departments"
        ],
        notes: [
          "Participants are preferably required to bring their own Device or contact us beforehand for arrangment",
        ]
      },
    contacts: [{ name: "Neha", role: "Coordinator", phone: "+917003940156" }],
  },
  nabasrijan: {
    tagline: "A Stage for Original Creations",
    about: [
      "নবসৃজন’২৬ invites students from all departments to showcase their original creative work.",
      "Participants can present music, dance, poetry, storytelling, drama, visual arts, and other forms of cultural expression.",
      "Every entry must be the participant's own original creation, reflecting their individual ideas, imagination, and artistic expression."
    ],
    whatsappGroup: "https://chat.whatsapp.com/DtIvGZYswAl5MkscNkfO1L?s=cl&p=a&mlu=4&ilr=4&iam=2",
    //poster: "",
    //brochure: "",
    team: {
      size: "Not specified",
      eligibility: [
        "Students from all departments"
      ],
      notes: [
      ]
    },
    //prizes: [],
    rules: [
      "All submissions must be original work created by the participant.",
      "Entries should reflect the participant's own ideas and artistic expression.",
      "Participants may showcase music, dance, poetry, storytelling, drama, visual arts, or other forms of cultural expression."
    ],
    contacts: []
  },
  technovate: {
    tagline:
      "Think. Innovate. Make an Impact!",
    about: [
      "Participants explore technology-driven challenges, develop innovative solutions to real-world problems, and present their ideas.",
      "Theme: Your Idea. Your Research. Your Innovation.",
      "Sample Topics: Can we take back an email after sending it? Does music improve concentration while studying? Can we design a zero single-use plastic model for college festivals? Participants may also propose their own original ideation.",
      "Submission Format: Participants must submit an original research idea supported by a proper explanation in PDF format, ~ 500 words.",
      "Preliminary Round: Submit both the research PDF and a visually engaging PowerPoint presentation (PPT) before the final round.(Date of Submission will be notified)",
    ],
    whatsappGroup: "https://chat.whatsapp.com/GPlSg1VK17SKOdB0tqZdIh?s=cl&p=a&mlu=4&ilr=4&iam=2",
    // poster: "https://drive.google.com/file/d/XXXX/view",
    // brochure: "https://drive.google.com/file/d/XXXX/view",
    team: {
      size: "1–2 members",
      eligibility: [
        "Open to individual participants and teams of up to two members.",
      ],
      notes: [
        "No registration fee is required.",
      ],
    },
    // prizes: [{ place: "1st", reward: "..." }],
    rules: [
      "Participants must present an original research idea relevant to the chosen topic.",
      "The ideation must include a clear and scientifically sound explanation.",
      "The research PDF must not exceed 500 words.",
      "The preliminary submission must include both the PDF and PowerPoint presentation.",
      "Participants may select a sample topic or propose their own original ideation.",
      "Individual participation and teams of up to two members are permitted.",
    ],
    // contacts: [{ name: "...", role: "Coordinator", phone: "+91..." }],
  },
  quizstack: {
    tagline:
      " Think. Recall. Conquer.",
    about: [
      "Quiz Stack is a team-based quiz competition that challenges participants across multiple levels of questions, combining accuracy, speed and logical reasoning.",
      "Participation: Each team must consist of exactly two members.",
      "Fair Play: Any form of cheating, unauthorised assistance or unfair practice will result in immediate disqualification.",
    ],
    whatsappGroup: "https://chat.whatsapp.com/GWt3LoSbYwA19dgMVGkolE?s=cl&p=a&mlu=4&ilr=4&iam=2",
    // poster: "https://drive.google.com/file/d/XXXX/view",
    // brochure: "https://drive.google.com/file/d/XXXX/view",
    rules: [
      "Each team must consist of exactly two participants.",
      "Participants must follow the instructions and decisions of the event organisers.",
      "Any form of cheating, unauthorised assistance or unfair practice will result in immediate disqualification.",
      "Answers will be evaluated primarily on accuracy and correctness.",
      "Speed may provide an advantage where applicable, particularly in timed rounds.",
      "Logical reasoning and problem-solving skills may be assessed throughout the competition.",
    ],
    team: {
        size: "2 members",
        eligibility: [
          "Students from all departments"
        ],
        notes: [
        ]
      },
    contacts: [{ name: "Snehasish", role: "Coordinator", phone: "+918583096581" }],
  },
};