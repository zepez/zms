CREATE TABLE `media` (
	`id` text PRIMARY KEY NOT NULL,
	`av_format` text,
	`av_duration` text,
	`av_size` text,
	`av_bitrate` text,
	`audio_codec` text,
	`audio_sample_rate` text,
	`audio_channels` text,
	`video_codec` text,
	`video_width` text,
	`video_height` text,
	`video_aspect_ratio` text,
	`video_fps` text,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP
);
