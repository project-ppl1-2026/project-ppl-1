import Image from "next/image";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

import { teamMembers } from "./about-data";
import { SectionHeader, TeamCard } from "./about-primitives";

export function AboutTeamSection() {
  return (
    <section id="team" className="bg-card py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <SectionHeader
          label="TIM KAMI"
          title="Di Balik TemanTumbuh"
          description="Dibuat oleh mahasiswa Informatika Universitas Padjadjaran sebagai inovasi teknologi untuk kesejahteraan sosial."
        />

        <Card className="mb-12 border-about-light-teal bg-[linear-gradient(135deg,var(--about-bg-section)_0%,var(--about-light-teal)_100%)]">
          <CardContent className="flex flex-col items-center justify-between gap-5 p-6 sm:flex-row">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-about-dark-teal">
                <Image
                  src="/img/LOGO_TEMANTUMBUH.svg"
                  alt="TemanTumbuh"
                  width={40}
                  height={40}
                  className="h-10 w-10"
                />
              </div>
              <div>
                <p className="text-sm font-bold text-about-text-dark">
                  Teman Tumbuh <span className="font-extrabold">·</span>{" "}
                  Universitas Padjadjaran
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge className="rounded-xl bg-about-dark-teal px-4 py-2 text-white hover:bg-about-dark-teal">
                Kelompok Cegukan
              </Badge>
              <Badge
                variant="outline"
                className="rounded-xl border-2 border-about-dark-teal px-4 py-2 text-about-dark-teal"
              >
                Informatika 2023
              </Badge>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">
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
