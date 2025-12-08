-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 08, 2025 at 07:19 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `laravel_new`
--

-- --------------------------------------------------------

--
-- Table structure for table `cache`
--

CREATE TABLE `cache` (
  `key` varchar(255) NOT NULL,
  `value` mediumtext NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `cache`
--

INSERT INTO `cache` (`key`, `value`, `expiration`) VALUES
('laravel-cache-otp:login:01234567890', 'i:8582;', 1765209103),
('laravel-cache-otp:login:3434344', 'i:3432;', 1765040896),
('laravel-cache-otp:rate:01234567890', 'i:1;', 1765212523),
('laravel-cache-otp:rate:1231243253', 'i:1;', 1764525453),
('laravel-cache-otp:rate:1234445555', 'i:1;', 1765011309),
('laravel-cache-otp:rate:1234567890', 'i:2;', 1765212945),
('laravel-cache-otp:rate:124324235232', 'i:1;', 1764344635),
('laravel-cache-otp:rate:234432', 'i:1;', 1765051604),
('laravel-cache-otp:rate:2353252425', 'i:1;', 1764873684),
('laravel-cache-otp:rate:3434344', 'i:1;', 1765044316),
('laravel-cache-otp:rate:352353533', 'i:1;', 1765044250),
('laravel-cache-otp:rate:4234323', 'i:1;', 1765044415),
('laravel-cache-otp:rate:433353553', 'i:1;', 1765043380),
('laravel-cache-otp:rate:53262333272', 'i:3;', 1765051563),
('laravel-cache-otp:rate:56565656', 'i:1;', 1764423054),
('laravel-cache-otp:rate:78778787787', 'i:1;', 1764417129),
('laravel-cache-otp:rate:9303119152', 'i:1;', 1764344874),
('laravel-cache-otp:rate:fsfsd', 'i:1;', 1765051496);

-- --------------------------------------------------------

--
-- Table structure for table `cache_locks`
--

CREATE TABLE `cache_locks` (
  `key` varchar(255) NOT NULL,
  `owner` varchar(255) NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `cart_items`
--

CREATE TABLE `cart_items` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `product_id` bigint(20) UNSIGNED NOT NULL,
  `quantity` int(11) NOT NULL DEFAULT 1,
  `meta` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`meta`)),
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `cart_items`
--

INSERT INTO `cart_items` (`id`, `user_id`, `product_id`, `quantity`, `meta`, `created_at`, `updated_at`) VALUES
(18, 7, 1, 2, NULL, '2025-12-06 03:42:52', '2025-12-06 03:42:58'),
(19, 10, 2, 1, NULL, '2025-12-06 13:12:01', '2025-12-06 13:12:01');

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `slug` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`id`, `name`, `slug`, `description`, `created_at`, `updated_at`) VALUES
(1, 'Rockets', 'rockets', NULL, NULL, NULL),
(2, 'Sparklers', 'sparklers', NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `failed_jobs`
--

CREATE TABLE `failed_jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `connection` text NOT NULL,
  `queue` text NOT NULL,
  `payload` longtext NOT NULL,
  `exception` longtext NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `jobs`
--

CREATE TABLE `jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `queue` varchar(255) NOT NULL,
  `payload` longtext NOT NULL,
  `attempts` tinyint(3) UNSIGNED NOT NULL,
  `reserved_at` int(10) UNSIGNED DEFAULT NULL,
  `available_at` int(10) UNSIGNED NOT NULL,
  `created_at` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `job_batches`
--

CREATE TABLE `job_batches` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `total_jobs` int(11) NOT NULL,
  `pending_jobs` int(11) NOT NULL,
  `failed_jobs` int(11) NOT NULL,
  `failed_job_ids` longtext NOT NULL,
  `options` mediumtext DEFAULT NULL,
  `cancelled_at` int(11) DEFAULT NULL,
  `created_at` int(11) NOT NULL,
  `finished_at` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `migrations`
--

CREATE TABLE `migrations` (
  `id` int(10) UNSIGNED NOT NULL,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(14, '0001_01_01_000000_create_users_table', 1),
(15, '0001_01_01_000001_create_cache_table', 1),
(16, '0001_01_01_000002_create_jobs_table', 1),
(17, '2025_11_22_091921_create_categories_table', 1),
(18, '2025_11_22_092558_create_products_table', 1),
(19, '2025_11_22_092611_create_product_images_table', 1),
(20, '2025_11_22_092628_create_videos_table', 1),
(21, '2025_11_22_093112_create_cart_items_table', 1),
(22, '2025_11_22_093125_create_orders_table', 1),
(23, '2025_11_22_093135_create_order_items_table', 1),
(24, '2025_11_22_094744_create_video_analytics_table', 1),
(25, '2025_11_22_101529_create_personal_access_tokens_table', 1),
(26, '2025_11_23_115215_add_phone_and_provider_to_users_table', 1),
(27, '2025_12_05_181027_xxxx_add_guest_to_orders', 2);

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `guest_token` varchar(255) DEFAULT NULL,
  `guest_phone` varchar(255) DEFAULT NULL,
  `total_amount` decimal(12,2) DEFAULT NULL,
  `status` varchar(255) NOT NULL DEFAULT 'pending',
  `payment_id` varchar(255) DEFAULT NULL,
  `address` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`address`)),
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`id`, `user_id`, `guest_token`, `guest_phone`, `total_amount`, `status`, `payment_id`, `address`, `created_at`, `updated_at`) VALUES
(1, 14, NULL, NULL, 2100.00, 'pending', NULL, '\"demo\"', '2025-12-08 10:21:26', '2025-12-08 10:22:29'),
(2, 14, NULL, NULL, 2300.00, 'paid', NULL, NULL, '2025-12-08 10:29:14', '2025-12-08 10:29:14'),
(3, 14, NULL, NULL, 800.00, 'paid', NULL, NULL, '2025-12-08 10:30:39', '2025-12-08 10:30:39');

-- --------------------------------------------------------

--
-- Table structure for table `order_items`
--

CREATE TABLE `order_items` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `order_id` bigint(20) UNSIGNED NOT NULL,
  `product_id` bigint(20) UNSIGNED NOT NULL,
  `quantity` int(11) NOT NULL DEFAULT 1,
  `unit_price` decimal(10,2) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `order_items`
--

INSERT INTO `order_items` (`id`, `order_id`, `product_id`, `quantity`, `unit_price`, `created_at`, `updated_at`) VALUES
(1, 1, 2, 2, 800.00, '2025-12-08 10:21:26', '2025-12-08 10:21:26'),
(2, 1, 1, 1, 500.00, '2025-12-08 10:21:26', '2025-12-08 10:21:26'),
(3, 2, 2, 1, NULL, '2025-12-08 10:29:14', '2025-12-08 10:29:14'),
(4, 2, 1, 3, NULL, '2025-12-08 10:29:14', '2025-12-08 10:29:14'),
(5, 3, 2, 1, NULL, '2025-12-08 10:30:39', '2025-12-08 10:30:39');

-- --------------------------------------------------------

--
-- Table structure for table `password_reset_tokens`
--

CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `personal_access_tokens`
--

CREATE TABLE `personal_access_tokens` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `tokenable_type` varchar(255) NOT NULL,
  `tokenable_id` bigint(20) UNSIGNED NOT NULL,
  `name` text NOT NULL,
  `token` varchar(64) NOT NULL,
  `abilities` text DEFAULT NULL,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `personal_access_tokens`
--

INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES
(1, 'App\\Models\\User', 1, 'api-token', 'f01c248c29928f8e21f357ad232a9209ca94048ca864b6e832c27b40e2b64a44', '[\"*\"]', '2025-11-28 09:15:49', NULL, '2025-11-28 09:14:17', '2025-11-28 09:15:49'),
(2, 'App\\Models\\User', 2, 'api-token', 'a731be4fab980bf23395ccb7d51523f8142ccb79899ce815453f3d48ddfdad99', '[\"*\"]', '2025-11-29 05:10:27', NULL, '2025-11-28 09:18:28', '2025-11-29 05:10:27'),
(3, 'App\\Models\\User', 3, 'api-token', '535484af07dc260b68c2c71f419607f3b016532343e27793f1f74b638aa30c78', '[\"*\"]', '2025-11-29 06:05:55', NULL, '2025-11-29 05:22:21', '2025-11-29 06:05:55'),
(4, 'App\\Models\\User', 4, 'api-token', 'd073ea79fc3e8c229af6ac0c4b773df6de273126aad5793a0179e129e8ef82bd', '[\"*\"]', '2025-11-29 08:55:20', NULL, '2025-11-29 07:01:21', '2025-11-29 08:55:20'),
(5, 'App\\Models\\User', 5, 'api-token', '59302b34f7106f3f793407778694457726647f8c48532400feb624e6062cf1a8', '[\"*\"]', '2025-12-04 10:32:31', NULL, '2025-11-30 11:27:47', '2025-12-04 10:32:31'),
(6, 'App\\Models\\User', 6, 'api-token', 'c49f8d7c7f93cbf03e67587e637a06db774b627f25a99004de85c39301449a98', '[\"*\"]', '2025-12-04 12:11:55', NULL, '2025-12-04 12:11:48', '2025-12-04 12:11:55'),
(7, 'App\\Models\\User', 7, 'api-token', '2f2db1704e5ddf5afbeb4a1c6003fdfc224bd0359c47285b150a7573e651d645', '[\"*\"]', '2025-12-06 06:58:14', NULL, '2025-12-06 02:25:34', '2025-12-06 06:58:14'),
(8, 'App\\Models\\User', 8, 'api-token', 'ea7fa04c14a2d40de189f7d6fd1fd32f8b73e71e3c736561e9d406d396615f71', '[\"*\"]', '2025-12-06 11:24:04', NULL, '2025-12-06 11:20:01', '2025-12-06 11:24:04'),
(9, 'App\\Models\\User', 9, 'api-token', 'b5403b6cda7bd52222ece36db239637dcc8de75d0eb5942498022a74ea0c093a', '[\"*\"]', '2025-12-06 11:35:33', NULL, '2025-12-06 11:34:28', '2025-12-06 11:35:33'),
(10, 'App\\Models\\User', 10, 'api-token', '2e35a7d6da068c587e2d42d7fafb3809eb302169a6b1922f12a80000f025ed1b', '[\"*\"]', '2025-12-06 13:12:03', NULL, '2025-12-06 11:37:06', '2025-12-06 13:12:03'),
(11, 'App\\Models\\User', 11, 'api-token', 'd7803612f570ae5d57c8a985e74436af9a8f33bbba2a918a2499a8d94e369bed', '[\"*\"]', '2025-12-06 13:14:46', NULL, '2025-12-06 13:14:43', '2025-12-06 13:14:46'),
(12, 'App\\Models\\User', 11, 'api-token', 'bebf8fec8a1a1676b1f0b3b08e1ffc6c1aec40fe5643b3432574451105651646', '[\"*\"]', '2025-12-06 13:34:32', NULL, '2025-12-06 13:16:26', '2025-12-06 13:34:32'),
(13, 'App\\Models\\User', 12, 'api-token', '0704d4093f189bc68db0426992ea098c2462944fc0bed9bdf9604f5d1f961d3b', '[\"*\"]', '2025-12-06 13:35:16', NULL, '2025-12-06 13:35:08', '2025-12-06 13:35:16'),
(14, 'App\\Models\\User', 11, 'api-token', '55b6075157b72994c56633d59de34c956eb3090b31f5d32e8747610fa586986b', '[\"*\"]', '2025-12-06 13:36:19', NULL, '2025-12-06 13:36:16', '2025-12-06 13:36:19'),
(15, 'App\\Models\\User', 13, 'api-token', '28bdb400af0d88d8501bf890aac22fbef4c5dd10387e05a27ffa4bc777c5c3e1', '[\"*\"]', '2025-12-08 10:05:10', NULL, '2025-12-06 13:36:59', '2025-12-08 10:05:10'),
(16, 'App\\Models\\User', 14, 'api-token', 'a6273b351e5d79578bfd4b51374f36f5edbe55dacf41b7ea6e3f8983cf5fc182', '[\"*\"]', '2025-12-08 10:22:32', NULL, '2025-12-08 10:22:29', '2025-12-08 10:22:32'),
(17, 'App\\Models\\User', 14, 'api-token', '92b6a7fb6fe86b63f6e03e77f85abeb110802e94ee8c705ba0832b6f061f1990', '[\"*\"]', '2025-12-08 10:46:37', NULL, '2025-12-08 10:27:05', '2025-12-08 10:46:37');

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `title` varchar(255) NOT NULL,
  `slug` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `price` decimal(10,2) NOT NULL,
  `mrp` decimal(10,2) DEFAULT NULL,
  `stock` int(11) NOT NULL DEFAULT 0,
  `category_id` bigint(20) UNSIGNED DEFAULT NULL,
  `thumbnail_url` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `title`, `slug`, `description`, `price`, `mrp`, `stock`, `category_id`, `thumbnail_url`, `created_at`, `updated_at`) VALUES
(1, 'Fireworks Pack A', 'fireworks-pack-a', 'Amazing fireworks pack A', 500.00, 600.00, 3, 1, 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/BigBuckBunny.jpg', '2025-11-28 09:04:54', '2025-12-08 10:29:14'),
(2, 'Fireworks Pack B', 'fireworks-pack-b', 'Great pack B', 800.00, 900.00, 37, 2, 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/ElephantsDream.jpg', '2025-11-28 09:04:54', '2025-12-08 10:30:39');

-- --------------------------------------------------------

--
-- Table structure for table `product_images`
--

CREATE TABLE `product_images` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `product_id` bigint(20) UNSIGNED NOT NULL,
  `url` varchar(255) NOT NULL,
  `is_primary` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

CREATE TABLE `sessions` (
  `id` varchar(255) NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `payload` longtext NOT NULL,
  `last_activity` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `sessions`
--

INSERT INTO `sessions` (`id`, `user_id`, `ip_address`, `user_agent`, `payload`, `last_activity`) VALUES
('1CPHG4wA1NfPyQFAQtaDnCRV6vw8AhRHRmMKsX6L', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiYjhUYnpvYjRHR3Y4VzRTc09oWWplVGJlU2dLWld6MzJncWFZOVd6MSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDI6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9zdHJlYW0vc2FtcGxlLTVzLm1wNCI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1764419504),
('oY3U0tWsoJTLTZZ3TAhj09V3r80xrVVkdxeX7aZl', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiTko3RmVwU0VUa1RpS25tSmxQS2xteDF0R0hhR1dWSUV6dTk5d0IxdSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDM6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9zdHJlYW0vc2FtcGxlLTE1cy5tcDQiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1764864407),
('QDcukZFfgEZigRbn5Efx7ANSyF68xzYCrfYEH7Q1', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiNUhzVDdVRDN2TlNpcFVKSkxQYjhCaGRZdkZ3QXpwRHRaQ0cydGdqbiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDI6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9zdHJlYW0vc2FtcGxlLTVzLm1wNCI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1764864050),
('ujoclZKs3GVAS1wPnWhGzChhZGp7zcjCMGPk1zkd', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiZTZGUzZoVWFPVDMwbVBmT2dyRjNlRmNybHBvaGF2Um54Wm9FeUFCTyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDI6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9zdHJlYW0vc2FtcGxlLTVzLm1wNCI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1764864064),
('ZvHbpr1sR3B3F96jw1ER72XajdLzep2P9FCBzfxi', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoidERtclA4N2wxVFVJSlhVQ1h4ZjlJa3FWbnlwZm8wMTdTa21aR0YzVCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDI6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9zdHJlYW0vc2FtcGxlLTVzLm1wNCI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1764863889);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `phone_verified_at` timestamp NULL DEFAULT NULL,
  `provider` varchar(255) DEFAULT NULL,
  `provider_id` varchar(255) DEFAULT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `phone`, `phone_verified_at`, `provider`, `provider_id`, `email_verified_at`, `password`, `remember_token`, `created_at`, `updated_at`) VALUES
(1, NULL, NULL, '124324235232', '2025-11-28 09:14:17', NULL, NULL, NULL, NULL, NULL, '2025-11-28 09:14:17', '2025-11-28 09:14:17'),
(2, NULL, NULL, '9303119152', '2025-11-28 09:18:28', NULL, NULL, NULL, NULL, NULL, '2025-11-28 09:18:28', '2025-11-28 09:18:28'),
(3, NULL, NULL, '78778787787', '2025-11-29 05:22:21', NULL, NULL, NULL, NULL, NULL, '2025-11-29 05:22:21', '2025-11-29 05:22:21'),
(4, NULL, NULL, '56565656', '2025-11-29 07:01:21', NULL, NULL, NULL, NULL, NULL, '2025-11-29 07:01:21', '2025-11-29 07:01:21'),
(5, NULL, NULL, '1231243253', '2025-11-30 11:27:46', NULL, NULL, NULL, NULL, NULL, '2025-11-30 11:27:46', '2025-11-30 11:27:46'),
(6, NULL, NULL, '2353252425', '2025-12-04 12:11:48', NULL, NULL, NULL, NULL, NULL, '2025-12-04 12:11:48', '2025-12-04 12:11:48'),
(7, NULL, NULL, '1234445555', '2025-12-06 02:25:34', NULL, NULL, NULL, NULL, NULL, '2025-12-06 02:25:34', '2025-12-06 02:25:34'),
(8, NULL, NULL, '433353553', '2025-12-06 11:20:01', NULL, NULL, NULL, NULL, NULL, '2025-12-06 11:20:01', '2025-12-06 11:20:01'),
(9, NULL, NULL, '352353533', '2025-12-06 11:34:28', NULL, NULL, NULL, NULL, NULL, '2025-12-06 11:34:28', '2025-12-06 11:34:28'),
(10, NULL, NULL, '4234323', '2025-12-06 11:37:06', NULL, NULL, NULL, NULL, NULL, '2025-12-06 11:37:06', '2025-12-06 11:37:06'),
(11, NULL, NULL, '53262333272', '2025-12-06 13:36:15', NULL, NULL, NULL, NULL, NULL, '2025-12-06 13:14:43', '2025-12-06 13:36:15'),
(12, NULL, NULL, 'fsfsd', '2025-12-06 13:35:08', NULL, NULL, NULL, NULL, NULL, '2025-12-06 13:35:08', '2025-12-06 13:35:08'),
(13, NULL, NULL, '234432', '2025-12-06 13:36:59', NULL, NULL, NULL, NULL, NULL, '2025-12-06 13:36:59', '2025-12-06 13:36:59'),
(14, NULL, NULL, '1234567890', '2025-12-08 10:27:05', NULL, NULL, NULL, NULL, NULL, '2025-12-08 10:22:29', '2025-12-08 10:27:05');

-- --------------------------------------------------------

--
-- Table structure for table `videos`
--

CREATE TABLE `videos` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `product_id` bigint(20) UNSIGNED NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `url` varchar(255) NOT NULL,
  `duration_seconds` int(11) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `videos`
--

INSERT INTO `videos` (`id`, `product_id`, `title`, `url`, `duration_seconds`, `created_at`, `updated_at`) VALUES
(1, 1, 'Demo Video A', 'sample-5s.mp4', NULL, NULL, NULL),
(2, 2, 'Demo Video B', 'sample-15s.mp4', NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `video_analytics`
--

CREATE TABLE `video_analytics` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `video_id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `watched_seconds` int(11) NOT NULL DEFAULT 0,
  `event` varchar(255) DEFAULT NULL,
  `ip` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `cache`
--
ALTER TABLE `cache`
  ADD PRIMARY KEY (`key`);

--
-- Indexes for table `cache_locks`
--
ALTER TABLE `cache_locks`
  ADD PRIMARY KEY (`key`);

--
-- Indexes for table `cart_items`
--
ALTER TABLE `cart_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `cart_items_user_id_foreign` (`user_id`),
  ADD KEY `cart_items_product_id_foreign` (`product_id`);

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `categories_slug_unique` (`slug`);

--
-- Indexes for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`);

--
-- Indexes for table `jobs`
--
ALTER TABLE `jobs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `jobs_queue_index` (`queue`);

--
-- Indexes for table `job_batches`
--
ALTER TABLE `job_batches`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD KEY `orders_user_id_foreign` (`user_id`),
  ADD KEY `orders_guest_token_index` (`guest_token`),
  ADD KEY `orders_guest_phone_index` (`guest_phone`);

--
-- Indexes for table `order_items`
--
ALTER TABLE `order_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `order_items_order_id_foreign` (`order_id`),
  ADD KEY `order_items_product_id_foreign` (`product_id`);

--
-- Indexes for table `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD PRIMARY KEY (`email`);

--
-- Indexes for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  ADD KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`),
  ADD KEY `personal_access_tokens_expires_at_index` (`expires_at`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `products_slug_unique` (`slug`),
  ADD KEY `products_category_id_foreign` (`category_id`);

--
-- Indexes for table `product_images`
--
ALTER TABLE `product_images`
  ADD PRIMARY KEY (`id`),
  ADD KEY `product_images_product_id_foreign` (`product_id`);

--
-- Indexes for table `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sessions_user_id_index` (`user_id`),
  ADD KEY `sessions_last_activity_index` (`last_activity`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_email_unique` (`email`),
  ADD UNIQUE KEY `users_phone_unique` (`phone`);

--
-- Indexes for table `videos`
--
ALTER TABLE `videos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `videos_product_id_foreign` (`product_id`);

--
-- Indexes for table `video_analytics`
--
ALTER TABLE `video_analytics`
  ADD PRIMARY KEY (`id`),
  ADD KEY `video_analytics_video_id_foreign` (`video_id`),
  ADD KEY `video_analytics_user_id_foreign` (`user_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `cart_items`
--
ALTER TABLE `cart_items`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `jobs`
--
ALTER TABLE `jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `order_items`
--
ALTER TABLE `order_items`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `product_images`
--
ALTER TABLE `product_images`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `videos`
--
ALTER TABLE `videos`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `video_analytics`
--
ALTER TABLE `video_analytics`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `cart_items`
--
ALTER TABLE `cart_items`
  ADD CONSTRAINT `cart_items_product_id_foreign` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `cart_items_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `order_items`
--
ALTER TABLE `order_items`
  ADD CONSTRAINT `order_items_order_id_foreign` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `order_items_product_id_foreign` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `products_category_id_foreign` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `product_images`
--
ALTER TABLE `product_images`
  ADD CONSTRAINT `product_images_product_id_foreign` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `videos`
--
ALTER TABLE `videos`
  ADD CONSTRAINT `videos_product_id_foreign` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `video_analytics`
--
ALTER TABLE `video_analytics`
  ADD CONSTRAINT `video_analytics_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `video_analytics_video_id_foreign` FOREIGN KEY (`video_id`) REFERENCES `videos` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
