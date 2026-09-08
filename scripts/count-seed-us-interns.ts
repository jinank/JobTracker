import { fetchGreenhouseJobs } from "../lib/jobs/fetchers/greenhouse";
import { isInternshipTitle, isUsInternship } from "../lib/jobs/isUsInternship";
import { resolveGreenhouseLocation } from "../lib/jobs/resolveGreenhouseLocation";
import { INTERNSHIP_SOURCE_SEED } from "../lib/jobs/seedSources";

async function main() {
  for (const src of INTERNSHIP_SOURCE_SEED) {
    if (src.ats !== "greenhouse") continue;
    try {
      const jobs = await fetchGreenhouseJobs(src.board_token);
      let us = 0;
      for (const job of jobs) {
        const loc = resolveGreenhouseLocation(job);
        if (!isInternshipTitle(job.title)) continue;
        if (isUsInternship(job.title, loc)) us++;
      }
      if (us > 0) console.log(`${src.company}: ${us} US interns`);
    } catch (e) {
      console.log(`${src.company}: ERROR`);
    }
  }
}

main();
