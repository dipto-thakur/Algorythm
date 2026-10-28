import { schedule } from "@/data/schedule";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ScheduleDraft } from "./ScheduleDraft";
import { ScheduleTimeline } from "./ScheduleTimeline";

export function ScheduleSection() {
  return (
    <section id="schedule" aria-labelledby="schedule-title" className="rail-bounded pb-24">
      <Reveal>
        <SectionHeading id="schedule-title" label="Event Outline" title="event ki rooprekha" color="blue" />
      </Reveal>
      <div className="px-5 pt-16 sm:px-8">
        {schedule.length > 0 ? <ScheduleTimeline items={schedule} /> : <ScheduleDraft />}
      </div>
    </section>
  );
}