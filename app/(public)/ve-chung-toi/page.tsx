"use client";

import * as React from "react";
import Image from "next/image";
import { ArrowRight, Heart, Users } from "lucide-react";

import { MarketingCard } from "@/components/marketing/MarketingCard";
import { MetricCard } from "@/components/marketing/MetricCard";
import { PageHero } from "@/components/marketing/PageHero";
import { PrimaryCta } from "@/components/marketing/PrimaryCta";
import { SectionShell } from "@/components/marketing/SectionShell";
import { Badge } from "@/components/ui/badge";
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { AboutUsData, AboutUsTabKey } from "@/types/about-us.type";

import rawData from "./data.json";

const DATA = rawData as AboutUsData;

function toneToTextClass(tone: string | undefined) {
  switch (tone) {
    case "sun":
      return "text-yellow-300";
    case "emerald":
      return "text-emerald-300";
    case "orange":
      return "text-orange-300";
    case "sky":
      return "text-sky-300";
    case "rose":
      return "text-rose-300";
    default:
      return "text-white";
  }
}

function toneToRingBg(tone: string | undefined) {
  switch (tone) {
    case "emerald":
      return "bg-emerald-500/15 ring-emerald-400";
    case "orange":
      return "bg-orange-500/15 ring-orange-400";
    case "sky":
      return "bg-sky-500/15 ring-sky-400";
    case "rose":
      return "bg-rose-500/15 ring-rose-400";
    default:
      return "bg-slate-500/15 ring-slate-400";
  }
}

function toneToDot(tone: string | undefined) {
  switch (tone) {
    case "orange":
      return "bg-orange-500";
    case "emerald":
      return "bg-emerald-500";
    case "sky":
      return "bg-sky-500";
    case "slate":
      return "bg-slate-800";
    case "rose":
      return "bg-rose-500";
    default:
      return "bg-slate-600";
  }
}

function HeroSection() {
  return (
    <PageHero
      imageSrc={DATA.hero.image_url}
      imageAlt={DATA.hero.title}
      imageClassName="object-[center_40%]"
      overlayClassName="bg-linear-to-br from-slate-950/90 via-slate-900/75 to-slate-800/60"
      containerClassName="max-w-6xl py-16 md:py-20"
      badge={
        <Badge className="gap-2 rounded-full bg-orange-500/15 px-4 py-1.5 text-orange-300 hover:bg-orange-500/15">
          <Heart className="h-3.5 w-3.5 text-orange-400" />
          <span className="text-xs font-bold tracking-wide">{DATA.hero.badge}</span>
        </Badge>
      }
      title={
        <h1 className="max-w-2xl whitespace-pre-line text-4xl font-black leading-tight text-white md:text-6xl">
          {DATA.hero.title}
        </h1>
      }
      description={
        <p className="max-w-xl text-sm leading-7 text-white/80 md:text-base">
          {DATA.hero.description}
        </p>
      }
    />
  );
}

function StatsStrip() {
  return (
    <section className="bg-linear-to-br from-slate-900 to-slate-800">
      <div className="mx-auto grid w-full max-w-6xl grid-cols-2 gap-6 px-6 py-8 sm:grid-cols-3 lg:grid-cols-5">
        {DATA.stats.map((stat) => (
          <MetricCard
            key={stat.label}
            value={stat.value}
            label={stat.label}
            valueClassName={`text-2xl ${toneToTextClass(stat.tone)}`}
            labelClassName="text-xs text-white/60"
          />
        ))}
      </div>
    </section>
  );
}

function StoryTab() {
  return (
    <div className="grid gap-10 md:grid-cols-2 md:items-center">
      <div>
        <h2 className="whitespace-pre-line text-2xl font-black leading-snug text-slate-900 md:text-4xl">
          {DATA.story.heading}
        </h2>

        <div className="mt-5 space-y-4 text-sm leading-7 text-slate-600">
          {DATA.story.paragraphs.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {DATA.story.values.slice(0, 2).map((value) => (
            <MarketingCard key={value.title} variant="soft" className="rounded-2xl">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2">
                  <span className="text-2xl">{value.emoji}</span>
                  <span className="text-sm font-bold text-slate-900">{value.title}</span>
                </CardTitle>
                <CardDescription className="text-xs leading-5 text-slate-600">
                  {value.description}
                </CardDescription>
              </CardHeader>
            </MarketingCard>
          ))}
        </div>

        <div className="mt-7">
          <PrimaryCta href={DATA.story.cta.href} variant="warm">
            <Heart className="h-4 w-4" />
            {DATA.story.cta.label}
            <ArrowRight className="h-4 w-4" />
          </PrimaryCta>
        </div>
      </div>

      <div className="grid gap-4">
        <div className="overflow-hidden rounded-3xl">
          <Image
            src={DATA.story.gallery.primary_image_url}
            alt=""
            width={600}
            height={400}
            className="h-64 w-full object-cover"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="overflow-hidden rounded-2xl">
            <Image
              src={DATA.story.gallery.secondary_image_url}
              alt=""
              width={600}
              height={400}
              className="h-36 w-full object-cover"
            />
          </div>

          <MarketingCard variant="dark" className="rounded-2xl">
            <CardContent className="p-4">
              <div className="space-y-2">
                {DATA.story.gallery.highlights.map((highlight) => (
                  <div key={highlight.text} className="flex items-center gap-2 text-xs">
                    <span className="text-base">{highlight.emoji}</span>
                    <span className="text-white/85">{highlight.text}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </MarketingCard>
        </div>
      </div>
    </div>
  );
}

function TeamTab() {
  return (
    <div>
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-2xl font-black text-slate-900 md:text-4xl">
          {DATA.team.title}
        </h2>
        <p className="mt-3 text-sm leading-7 text-slate-600">
          {DATA.team.description}
        </p>
      </div>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {DATA.team.members.map((member) => (
          <MarketingCard key={member.name} className="text-center">
            <CardContent className="p-6">
              <div
                className={
                  "mx-auto grid h-18 w-18 place-items-center rounded-full ring-2 " +
                  toneToRingBg(member.tone)
                }
              >
                <span className="text-3xl">{member.avatar_emoji}</span>
              </div>

              <div className="mt-4 text-base font-extrabold text-slate-900">
                {member.name}
              </div>
              <div className="mt-1 text-xs text-slate-500">{member.role}</div>

              <div className="mt-4 flex flex-wrap justify-center gap-2">
                <Badge
                  variant="secondary"
                  className="rounded-full bg-slate-100 text-[10px] font-semibold text-slate-700 hover:bg-slate-100"
                >
                  {member.badge}
                </Badge>
                <Badge
                  variant="outline"
                  className="rounded-full bg-slate-50 text-[10px] font-semibold text-slate-500"
                >
                  â± {member.years}
                </Badge>
              </div>
            </CardContent>
          </MarketingCard>
        ))}
      </div>

      <MarketingCard variant="dark" className="mt-12 text-center">
        <CardContent className="px-6 py-10 md:px-12">
          <div className="text-4xl">ðŸ¤</div>
          <h3 className="mt-4 text-2xl font-black">{DATA.team.volunteerCta.title}</h3>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-white/75">
            {DATA.team.volunteerCta.description}
          </p>

          <div className="mx-auto mt-6 flex max-w-3xl flex-wrap justify-center gap-2">
            {DATA.team.volunteerCta.chips.map((chip) => (
              <Badge
                key={chip}
                variant="outline"
                className="rounded-full border-white/20 bg-white/10 px-4 py-1.5 text-xs text-white hover:bg-white/10"
              >
                {chip}
              </Badge>
            ))}
          </div>

          <div className="mt-7">
            <PrimaryCta href={DATA.team.volunteerCta.href} variant="mint">
              <Users className="h-4 w-4" />
              {DATA.team.volunteerCta.label}
              <ArrowRight className="h-4 w-4" />
            </PrimaryCta>
          </div>
        </CardContent>
      </MarketingCard>
    </div>
  );
}

function TimelineTab() {
  return (
    <div className="mx-auto max-w-2xl">
      <h2 className="text-center text-2xl font-black text-slate-900 md:text-4xl">
        {DATA.timeline.title}
      </h2>

      <div className="relative mt-10 pl-10">
        <div className="absolute left-4 top-0 h-full w-0.5 bg-linear-to-b from-orange-500 via-emerald-500 to-rose-500" />

        <div className="space-y-8">
          {DATA.timeline.events.map((event) => (
            <div key={`${event.year}-${event.title}`} className="relative">
              <div
                className={
                  "absolute -left-8.5 top-1.5 h-5 w-5 rounded-full ring-4 ring-white/90 " +
                  toneToDot(event.tone)
                }
              />

              <MarketingCard className="rounded-3xl p-6">
                <div className="flex items-center gap-3">
                  <div className="text-xl font-black text-slate-900">{event.year}</div>
                  <div className="h-5 w-px bg-slate-200" />
                  <div className="text-sm font-bold text-slate-900">{event.title}</div>
                </div>
                <p className="mt-2 text-sm leading-7 text-slate-600">
                  {event.description}
                </p>
              </MarketingCard>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function AboutUsPage() {
  const [activeTab, setActiveTab] = React.useState<AboutUsTabKey>("story");

  return (
    <div className="min-h-screen bg-slate-50">
      <HeroSection />
      <StatsStrip />

      <SectionShell
        className="bg-transparent px-0 py-0"
        containerClassName="max-w-6xl px-6 py-10 md:py-14"
      >
        <Tabs
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as AboutUsTabKey)}
        >
          <TabsList
            variant="line"
            className="mb-10 w-full justify-start overflow-x-auto rounded-none border-b border-slate-200 bg-transparent p-0"
          >
            {DATA.tabs.map((tab) => (
              <TabsTrigger
                key={tab.key}
                value={tab.key}
                className="rounded-none px-4 py-3"
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="story">
            <StoryTab />
          </TabsContent>
          <TabsContent value="team">
            <TeamTab />
          </TabsContent>
          <TabsContent value="timeline">
            <TimelineTab />
          </TabsContent>
        </Tabs>
      </SectionShell>
    </div>
  );
}
