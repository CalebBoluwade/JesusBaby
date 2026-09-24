"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

function ProjectLink({ project }: { project: Project & { comingSoon?: boolean } }) {
  const className = "mt-4 inline-block bg-white px-3 py-2 text-sm font-medium text-black transition-colors hover:bg-gray-200";
  const arrow = <ArrowRight className="mr-2 inline-block h-4 w-4 text-black transition-all group-hover:ms-0.5 rtl:rotate-180" />;

  if (project.projectUrl.startsWith("/")) {
    return <Link className={className} href={project.projectUrl}><span>View Project</span>{arrow}</Link>;
  }

  return <motion.a className={className} href={project.projectUrl} target="_blank" rel="noopener noreferrer" aria-disabled={project.comingSoon}><span>View Project</span>{arrow}</motion.a>;
}

const ProjectCard = ({
  project,
}: {
  project: Project & { comingSoon?: boolean };
}) => {
  return (
    <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.2 }} className="group relative block min-h-67.5 overflow-hidden rounded-2xl bg-black shadow-lg shadow-slate-900/10 transition-all hover:shadow-xl hover:shadow-indigo-950/20 dark:shadow-gray-700/25">
      <motion.img
        alt={project.name}
        src={project.imageUrl}
        className="absolute inset-0 h-full w-full object-cover opacity-70 transition duration-500 group-hover:scale-105 group-hover:opacity-50"
      />

      {project.comingSoon && (
        <span className="absolute top-3 right-3 z-20 inline-flex items-center px-2.5 py-1 rounded-full bg-yellow-400 text-xs font-semibold text-black shadow-sm">
          Coming Soon
        </span>
      )}

      <div className="relative flex h-full min-h-67.5 flex-col rounded-lg p-5 sm:p-6">
        <p className="text-sm font-medium tracking-widest text-pink-500 uppercase text-wrap">
          {project.brandName}
        </p>

        <p className="text-xl font-bold text-white sm:text-2xl">
          {project.name}
        </p>

        {/* Push reveal section to the bottom */}
        <div className="mt-auto pt-12 rounded-lg">
          <div className="translate-y-8 transform opacity-0 transition-all group-hover:translate-y-0 group-hover:opacity-100">
            <p className="text-sm text-white line-clamp-3">
              {project.description}
            </p>

            <ProjectLink project={project} />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectCard;
