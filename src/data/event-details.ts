import type { EventDetails } from "@/types/site";

// Every field optional. Empty = section hidden.
export const eventDetails: Record<string, EventDetails> = {
  codesclash: {
    tagline: "Think. Code. Compete. Create.",
about: [
  "CodesClash is a college-level coding competition where students collaborate in teams to solve problems and build innovative projects within a limited time.",
  "Participants can compete across four tracks: Frontend Development, Fullstack Development, and AI/ML.",
  "The event encourages creativity, problem-solving, teamwork, and practical application of technical skills, with AI tools permitted according to the event guidelines."
],
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
          "Every team must select one track: Frontend, Fullstack, or AI/ML.",
          "All team members should contribute to the project and understand its implementation.",
          "Teams must submit their project within the deadline and be ready for the final presentation.",
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
      "Device Requirement: Participants are preferably required to bring their own laptop, tablet or Mac for the challenge.",
    ],
    // poster: "https://drive.google.com/file/d/XXXX/view",
    // brochure: "https://drive.google.com/file/d/XXXX/view",
    rules: [
      "Participation is strictly individual. No team submissions are allowed.",
      "Canva must be the only design platform used to create the final submission.",
      "The use of AI tools or external design, editing or generative tools outside Canva is strictly prohibited.",
      "Participants must create original work and must not copy or reproduce another person's design.",
      "Submissions must address the given brief and follow the instructions provided by the organisers.",
      "Participants should bring their own laptop, tablet or Mac, preferably with access to Canva.",
      "Organisers' decisions regarding rule violations and disqualification will be final.",
    ],
    // prizes: [{ place: "1st", reward: "..." }],
    team: {
        size: "1 member",
        eligibility: [
          "Students from all departments"
        ],
        notes: [
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
    // tagline: "",
    // about: ["..."],
    // poster: "https://drive.google.com/file/d/XXXX/view",
    // brochure: "https://drive.google.com/file/d/XXXX/view",
    // team: { size: "2-3 members", eligibility: ["..."], notes: ["..."] },
    // prizes: [{ place: "1st", reward: "..." }],
    // rules: ["..."],
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
    // poster: "https://drive.google.com/file/d/XXXX/view",
    // brochure: "https://drive.google.com/file/d/XXXX/view",
    rules: [
      "Each team must consist of exactly two participants.",
      "Participants must follow the instructions and decisions of the event organisers.",
      "Any form of cheating, unauthorised assistance or unfair practice will result in immediate disqualification.",
      "Answers will be evaluated primarily on accuracy and correctness.",
      "Speed may provide an advantage where applicable, particularly in timed rounds.",
      "Logical reasoning and problem-solving skills may be assessed throughout the competition.",
      "Teams are expected to maintain consistent performance across multiple rounds and difficulty levels.",
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