import React from 'react';
import { CheckCircle, Circle } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion } from 'framer-motion';

const stages = ['Received', 'Cleaning', 'Carding', 'Spinning', 'Finished'];

const BatchTimeline = ({ currentStage }) => {
    const currentIndex = stages.indexOf(currentStage);

    return (
        <div className="flex items-center justify-between w-full relative">
            {/* Background Line */}
            <div className="absolute top-5 left-0 w-full h-1 bg-gray-200 rounded-full z-0" />

            {stages.map((stage, index) => {
                const isCompleted = index <= currentIndex;
                const isCurrent = index === currentIndex;

                return (
                    <div key={stage} className="flex flex-col items-center relative z-10 w-full">
                        {/* Connecting Line (Active) */}
                        {index < stages.length - 1 && (
                            <motion.div
                                initial={{ width: '0%' }}
                                animate={{ width: index < currentIndex ? '100%' : '0%' }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                                className="absolute top-5 left-[50%] h-1 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full z-0"
                                style={{ width: '100%' }} // Note: Wrapper width handles logic, but absolute positioning makes it tricky. Better approach below.
                            />
                        )}
                        {/* Actually, let's keep the line simple for now to avoid layout shift issues with flexbox and absolute lines */}
                    </div>
                );
            })}

            {/* Better approach for lines: Render lines between nodes */}
            {stages.map((stage, index) => {
                const isCompleted = index <= currentIndex;
                const isCurrent = index === currentIndex;

                return (
                    <React.Fragment key={stage}>
                        <div className="relative flex flex-col items-center group">
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: index * 0.1 }}
                                className={cn(
                                    "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 z-10",
                                    isCompleted
                                        ? "bg-primary-500 border-primary-500 text-white shadow-neon"
                                        : "bg-white border-gray-300 text-gray-400",
                                    isCurrent && "ring-4 ring-primary-200 shadow-neon scale-110"
                                )}
                            >
                                {isCompleted ? <CheckCircle size={18} /> : <Circle size={18} />}
                            </motion.div>
                            <span className={cn(
                                "mt-3 text-xs md:text-sm font-medium transition-colors duration-300 absolute -bottom-8 w-24 text-center",
                                isCompleted ? "text-primary-600" : "text-gray-400"
                            )}>
                                {stage}
                            </span>
                        </div>

                        {index < stages.length - 1 && (
                            <div className="flex-1 h-1 bg-gray-200 mx-2 relative rounded-full overflow-hidden">
                                <motion.div
                                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary-500 to-primary-400"
                                    initial={{ width: '0%' }}
                                    animate={{ width: index < currentIndex ? '100%' : '0%' }}
                                    transition={{ duration: 0.5, ease: "easeInOut" }}
                                />
                            </div>
                        )}
                    </React.Fragment>
                );
            })}
        </div>
    );
};

export default BatchTimeline;
