/* Seed for DITC Smart Club. Run: npm run db:seed (needs prisma generate + db push first). */
import { PrismaClient } from "@prisma/client";
import { randomBytes, scryptSync } from "node:crypto";

const prisma = new PrismaClient();

function hashPw(pw) {
  const salt = randomBytes(16).toString("hex");
  return `scrypt$${salt}$${scryptSync(pw, salt, 64).toString("hex")}`;
}

const NAMES = ["Ayesha Rahman", "Tanvir Hasan", "Nusrat Jahan", "Arif Chowdhury", "Mim Akter", "Sakib Ahmed", "Priya Das", "Rafiul Islam", "Tania Sultana", "Mehedi Khan", "Farhana Yeasmin", "Sabbir Hossain", "Riya Ghosh", "Nabil Karim", "Sadia Afrin", "Hasan Mahmud", "Isha Verma", "Rakib Uddin", "Anika Tabassum", "Fahim Reza", "Lamia Akter", "Shafin Ahmed", "Nadia Islam", "Tawsif Rahman", "Maliha Khan", "Asif Iqbal", "Rubaiya Jannat", "Tamim Anwar", "Shaila Sharmin", "Omar Faruk"];

const DAY = 86_400_000;
const now = Date.now();
const d = (offsetDays, h = 10) => {
  const t = new Date(now + offsetDays * DAY);
  t.setHours(h, 0, 0, 0);
  return t;
};

async function main() {
  await prisma.registration.deleteMany();
  await prisma.event.deleteMany();
  await prisma.fest.deleteMany();
  await prisma.user.deleteMany();
  await prisma.organization.deleteMany();

  const org = await prisma.organization.create({
    data: { name: "DRMC IT Club", slug: "drmc-it-club", description: "Student tech organization running fests, contests and workshops." },
  });

  const festDefs = [
    { title: "Tech Carnival 2026", slug: "tech-carnival-2026", venue: "DRMC Campus", start: d(30), end: d(32, 18), desc: "Flagship fest with contests across AI, programming, robotics and gaming." },
    { title: "Winter Tech Fest 2026", slug: "winter-tech-fest-2026", venue: "DRMC Auditorium", start: d(70), end: d(71, 18), desc: "Hackathons, hands-on workshops and quizzes to close the year." },
    { title: "Freshers Tech Fest 2027", slug: "freshers-tech-fest-2027", venue: "DRMC Campus", start: d(120), end: d(121, 18), desc: "Welcome fest for newcomers: coding challenges and AI workshops." },
  ];
  const fests = [];
  for (const f of festDefs) {
    fests.push(await prisma.fest.create({ data: { orgId: org.id, title: f.title, slug: f.slug, description: f.desc, venue: f.venue, startDate: f.start, endDate: f.end, status: "published", banner: `https://picsum.photos/seed/${f.slug}/640/200` } }));
  }

  const ev = (fest, i, o) => ({ festId: fest.id, ...o, slug: `${fest.slug}-e${i}`, image: `https://picsum.photos/seed/${fest.slug}-e${i}/560/320` });
  const eventDefs = [
    ev(fests[0], 1, { title: "AI Web Development Contest", category: "contest", venue: "Lab 1", startAt: d(30), endAt: d(30, 17), registrationDeadline: d(28, 23), capacity: 60, fee: 0, description: "Build a club operations platform: fest directory, registration, organizer tools. Judged live." }),
    ev(fests[0], 2, { title: "Programming Contest", category: "contest", venue: "Lab 2", startAt: d(31), endAt: d(31, 15), registrationDeadline: d(29, 23), capacity: 80, fee: 100, description: "Classic ICPC-style sprint: 8 problems, 4 hours, one winning team." }),
    ev(fests[0], 3, { title: "Robotics Challenge", category: "robotics", venue: "Field", startAt: d(31, 14), endAt: d(31, 18), registrationDeadline: d(29, 23), capacity: 24, fee: 300, description: "Line-follower and maze-solver bots compete head to head." }),
    ev(fests[0], 4, { title: "Gaming Tournament", category: "gaming", venue: "Hall B", startAt: d(32), endAt: d(32, 18), registrationDeadline: d(30, 23), capacity: 64, fee: 150, description: "Bracket tournament across two titles. Bring your own controller." }),
    ev(fests[1], 1, { title: "Winter Hackathon", category: "hackathon", venue: "Innovation Lab", startAt: d(70), endAt: d(71, 12), registrationDeadline: d(68, 23), capacity: 50, fee: 200, description: "36 hours, real problem statements from campus clubs, demo day judging." }),
    ev(fests[1], 2, { title: "Hands-on Workshop", category: "workshop", venue: "Lab 3", startAt: d(70, 14), endAt: d(70, 17), registrationDeadline: d(69, 23), capacity: 40, fee: 0, description: "Git, APIs and deployment basics. Laptops required." }),
    ev(fests[1], 3, { title: "Tech Quiz Finals", category: "quiz", venue: "Auditorium", startAt: d(71, 15), endAt: d(71, 18), registrationDeadline: d(70, 23), capacity: 100, fee: 0, description: "Buzzer quiz covering computing history, gadgets and logic puzzles." }),
    ev(fests[2], 1, { title: "Freshers Coding Challenge", category: "contest", venue: "Lab 1", startAt: d(120), endAt: d(120, 14), registrationDeadline: d(118, 23), capacity: 120, fee: 0, description: "Beginner-friendly contest with guided editorials after every problem." }),
    ev(fests[2], 2, { title: "AI Workshop for Beginners", category: "workshop", venue: "Lab 2", startAt: d(121), endAt: d(121, 16), registrationDeadline: d(119, 23), capacity: 45, fee: 0, description: "Prompting, agents and tiny web apps. No experience needed." }),
    ev(fests[0], 5, { title: "Lightning Talks", category: "seminar", venue: "Hall A", startAt: d(32, 11), endAt: d(32, 13), registrationDeadline: d(-2, 23), capacity: 90, fee: 0, description: "This one already closed so judges can see the Closed state." }),
    ev(fests[1], 4, { title: "Retro Game Night", category: "gaming", venue: "Hall B", startAt: d(70, 18), endAt: d(70, 22), registrationDeadline: d(69, 23), capacity: 6, fee: 0, description: "Tiny 6-seat night that fills up fast so judges can see the Full state." }),
  ];
  const events = [];
  for (const e of eventDefs) events.push(await prisma.event.create({ data: { ...e, status: "published", customFields: "[]" } }));

  await prisma.user.createMany({
    data: [
      // Initial demo accounts (documented in README). Passwords are scrypt
      // hashes in the DB; override via SEED_ORGANIZER_PASSWORD /
      // SEED_PARTICIPANT_PASSWORD env when seeding.
      { name: "Demo Organizer", email: "organizer@demo.local", phone: "01700000001", passwordHash: hashPw(process.env.SEED_ORGANIZER_PASSWORD ?? "Organizer123!"), role: "organizer" },
      { name: "Demo Participant", email: "participant@demo.local", phone: "01700000002", passwordHash: hashPw(process.env.SEED_PARTICIPANT_PASSWORD ?? "Participant123!"), role: "participant" },
    ],
  });

  const regs = [];
  events.forEach((e, ei) => {
    const isFull = ei === events.length - 1;
    const isClosed = ei === events.length - 2;
    const count = isFull ? e.capacity : isClosed ? 12 : 8 + ((ei * 3) % 9);
    for (let i = 0; i < count; i++) {
      const name = NAMES[(ei * 7 + i) % NAMES.length];
      const email = `${name.toLowerCase().replace(/[^a-z]+/g, ".")}.e${ei}.r${i}@example.com`;
      regs.push({ code: `E${ei}R${String(i).padStart(3, "0")}`, eventId: e.id, fullName: name, email, phone: `01${String(300000000 + ((ei * 131 + i * 17) % 699999999))}`, status: i % 11 === 0 ? "pending" : "confirmed" });
    }
  });
  for (const r of regs) {
    try {
      await prisma.registration.create({ data: { ...r, extraData: "{}" } });
    } catch { /* dupe guard */ }
  }

  console.log(`Seeded 1 org, ${fests.length} fests, ${events.length} events, ${regs.length} registration attempts.`);
}

main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
