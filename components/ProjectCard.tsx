"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const ProjectCard = ({ project }: { project: Project & { comingSoon?: boolean } }) => {
  return (
    <motion.div className="group relative rounded-lg block bg-black hover:shadow-lg transition-all dark:shadow-gray-700/25">
        <motion.img
          alt={project.name}
          src={project.imageUrl}
          className="rounded-lg absolute inset-0 h-full w-full object-cover opacity-75 transition-opacity group-hover:opacity-50"
        />

        {project.comingSoon && (
          <span className="absolute top-3 right-3 z-20 inline-flex items-center px-2.5 py-1 rounded-full bg-yellow-400 text-xs font-semibold text-black shadow-sm">
            Coming Soon
            <span className="sr-only"> — Still in the works</span>
          </span>
        )}

      <div className="relative rounded-lg p-4 sm:p-6 lg:p-8 flex flex-col h-full ">
        <p className="text-sm font-medium tracking-widest text-pink-500 uppercase">
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

            {project.projectUrl && (
              <motion.a
                className="mt-4 inline-block bg-white text-black px-3 py-2 rounded-full text-sm font-medium hover:bg-gray-200 transition-colors"
                href={project.projectUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-disabled={project.comingSoon ? true : false}
              >
                <span>View Project</span>
                <ArrowRight className="w-4 h-4 inline-block mr-2 text-black transition-all group-hover:ms-0.5 rtl:rotate-180" />
              </motion.a>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectCard;
