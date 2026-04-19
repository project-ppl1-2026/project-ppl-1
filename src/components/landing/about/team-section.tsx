import Image from "next/image";

import { teamMembers } from "./about-data";
import { SectionHeader, TeamCard } from "./about-primitives";

export function AboutTeamSection() {
  return (
    <section id="team" className="bg-card py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center">
        {/* Logo Tengah & Besar */}
        <Image
          src="/img/LOGO_TEMANTUMBUH.svg"
          alt="TemanTumbuh"
          width={120}
          height={120}
          className="mx-auto mb-4 h-28 w-28"
        />

        {/* Header tanpa label + diperlebar */}
        <div className="mx-auto max-w-6xl">
          <SectionHeader
            label=""
            title="Di Balik TemanTumbuh"
            description="Dibuat oleh mahasiswa Informatika Universitas Padjadjaran sebagai inovasi teknologi untuk kesejahteraan sosial."
          />
        </div>

        {/* Team Grid (tidak diubah) */}
        <div className="mt-12 grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">
          {teamMembers.map((member) => (
            <TeamCard
              key={member.name}
              name={member.name}
              role={member.role}
              subtitle={member.subtitle}
              imgSrc={member.imgSrc}
              isAdvisor={member.isAdvisor}
              isPlaceholder={member.isPlaceholder}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
