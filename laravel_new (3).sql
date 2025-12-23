-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 23, 2025 at 05:02 AM
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
('laravel-cache-otp:rate:+918770364802', 'i:1;', 1765737831),
('laravel-cache-otp:rate:1234567890', 'i:2;', 1765740859),
('laravel-cache-otp:rate:8516976461', 'i:1;', 1765740422),
('laravel-cache-otp:rate:9244889464', 'i:1;', 1765740624),
('laravel-cache-otp:rate:924889464', 'i:2;', 1765740778),
('laravel-cache-otp:rate:9999999990', 'i:1;', 1766433267),
('laravel-cache-otp:rate:99999999990', 'i:1;', 1765737737);

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
(9, 1, 2, 2, NULL, '2025-12-18 10:18:21', '2025-12-18 10:21:56'),
(14, 6, 1, 3, NULL, '2025-12-20 02:21:59', '2025-12-20 12:47:18'),
(15, 6, 5, 1, NULL, '2025-12-22 12:12:19', '2025-12-22 12:12:19'),
(16, 6, 9, 1, NULL, '2025-12-22 13:28:12', '2025-12-22 13:28:12');

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
(2, 'Sparklers', 'sparklers', NULL, NULL, NULL),
(3, 'Annar', 'annar', NULL, '2025-12-22 11:50:50', '2025-12-22 11:50:50'),
(4, 'Chakri', 'chakri', NULL, '2025-12-22 11:51:01', '2025-12-22 11:51:01'),
(5, 'FulJhadi', 'fuljhadi', NULL, '2025-12-22 11:51:34', '2025-12-22 11:51:34'),
(6, 'Popup', 'popup', NULL, '2025-12-22 11:51:54', '2025-12-22 11:51:54'),
(8, 'Kids Fancy', 'kids-fancy', NULL, '2025-12-22 11:52:45', '2025-12-22 11:52:45');

-- --------------------------------------------------------

--
-- Table structure for table `deliveries`
--

CREATE TABLE `deliveries` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `order_id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `status` enum('assigned','picked','delivered','failed') NOT NULL DEFAULT 'assigned',
  `collected_amount` decimal(10,2) DEFAULT NULL,
  `proof_image` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `deliveries`
--

INSERT INTO `deliveries` (`id`, `order_id`, `user_id`, `status`, `collected_amount`, `proof_image`, `created_at`, `updated_at`) VALUES
(1, 1, 4, 'delivered', 1295.00, NULL, '2025-12-13 01:52:18', '2025-12-13 01:55:39'),
(2, 25, 4, 'delivered', 2600.00, NULL, '2025-12-14 12:54:25', '2025-12-14 13:05:19'),
(3, 24, 7, 'delivered', 1298.00, NULL, '2025-12-14 12:55:35', '2025-12-14 12:58:00');

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
(9, '0001_01_01_000000_create_users_table', 1),
(10, '0001_01_01_000001_create_cache_table', 1),
(11, '0001_01_01_000002_create_jobs_table', 1),
(12, '2025_11_22_091921_create_categories_table', 1),
(13, '2025_11_22_092558_create_products_table', 1),
(14, '2025_11_22_092611_create_product_images_table', 1),
(15, '2025_11_22_092628_create_videos_table', 1),
(16, '2025_11_22_093112_create_cart_items_table', 1),
(17, '2025_11_22_093125_create_orders_table', 1),
(18, '2025_11_22_093135_create_order_items_table', 1),
(19, '2025_11_22_094744_create_video_analytics_table', 1),
(20, '2025_11_22_101529_create_personal_access_tokens_table', 1),
(21, '2025_11_23_115215_add_phone_and_provider_to_users_table', 1),
(22, '2025_12_05_181027_xxxx_add_guest_to_orders', 1),
(23, '2025_12_10_093525_add_role_to_users_table', 1),
(24, '2025_12_11_063955_add_address_columns_to_users_table', 1),
(25, '2025_12_11_064045_add_payment_details_to_orders_table', 1),
(26, '2025_12_11_110823_create_refunds_table', 1),
(27, '2025_12_11_112000_create_deliveries_table', 1),
(28, '2025_12_11_133224_add_collected_amount_to_deliveries_table', 1),
(29, '2025_12_12_083334_create_settlements_table', 1),
(30, '2025_12_12_093313_add_cost_price_to_products_table', 1),
(31, '2025_12_12_133025_add_images_to_refunds_table', 1),
(32, '2025_12_13_075846_create_wallet_transactions_table', 2),
(34, '2025_12_13_080802_add_wallet_balance_to_users_table', 3),
(35, '2025_12_14_072734_create_user_addresses_table', 4),
(36, '2025_12_14_144309_create_payment_transactions_table', 5),
(37, '2025_12_22_183925_add_unit_fields_to_products_table', 6);

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `total_amount` decimal(12,2) NOT NULL DEFAULT 0.00,
  `status` varchar(255) NOT NULL DEFAULT 'pending',
  `guest_token` varchar(255) DEFAULT NULL,
  `guest_phone` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `payment_method` varchar(255) DEFAULT NULL,
  `payment_details` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`payment_details`))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`id`, `user_id`, `total_amount`, `status`, `guest_token`, `guest_phone`, `created_at`, `updated_at`, `payment_method`, `payment_details`) VALUES
(1, 2, 1300.00, 'delivered', NULL, NULL, '2025-12-13 01:41:40', '2025-12-13 01:55:39', NULL, NULL),
(20, 2, 1300.00, 'pending', NULL, NULL, '2025-12-14 02:43:14', '2025-12-14 02:43:14', NULL, NULL),
(21, 2, 500.00, 'pending', NULL, NULL, '2025-12-14 02:45:48', '2025-12-14 02:45:48', NULL, NULL),
(22, 2, 800.00, 'pending', NULL, NULL, '2025-12-14 10:43:47', '2025-12-14 10:43:47', NULL, NULL),
(23, 2, 1800.00, 'pending', NULL, NULL, '2025-12-14 12:13:27', '2025-12-14 12:14:00', NULL, NULL),
(24, 2, 1300.00, 'delivered', NULL, NULL, '2025-12-14 12:14:58', '2025-12-14 12:58:00', NULL, NULL),
(25, 6, 2600.00, 'delivered', NULL, NULL, '2025-12-14 12:51:41', '2025-12-14 13:05:19', NULL, NULL),
(26, 6, 500.00, 'pending', NULL, NULL, '2025-12-14 13:16:50', '2025-12-14 13:16:50', NULL, NULL),
(27, 6, 2100.00, 'pending', NULL, NULL, '2025-12-18 13:36:10', '2025-12-18 13:36:10', NULL, NULL),
(30, 6, 500.00, 'pending', NULL, NULL, '2025-12-18 14:52:18', '2025-12-18 14:52:18', NULL, NULL),
(31, 6, 500.00, 'pending', NULL, NULL, '2025-12-18 15:06:19', '2025-12-18 15:06:19', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `order_items`
--

CREATE TABLE `order_items` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `order_id` bigint(20) UNSIGNED NOT NULL,
  `product_id` bigint(20) UNSIGNED NOT NULL,
  `quantity` int(11) NOT NULL DEFAULT 1,
  `unit_price` decimal(10,2) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `order_items`
--

INSERT INTO `order_items` (`id`, `order_id`, `product_id`, `quantity`, `unit_price`, `created_at`, `updated_at`) VALUES
(1, 1, 1, 1, 500.00, '2025-12-13 01:41:40', '2025-12-13 01:41:40'),
(2, 1, 2, 1, 800.00, '2025-12-13 01:41:40', '2025-12-13 01:41:40'),
(19, 20, 1, 1, 500.00, '2025-12-14 02:43:14', '2025-12-14 02:43:14'),
(20, 20, 2, 1, 800.00, '2025-12-14 02:43:14', '2025-12-14 02:43:14'),
(21, 21, 1, 1, 500.00, '2025-12-14 02:45:48', '2025-12-14 02:45:48'),
(22, 22, 2, 1, 800.00, '2025-12-14 10:43:47', '2025-12-14 10:43:47'),
(23, 23, 1, 2, 500.00, '2025-12-14 12:13:27', '2025-12-14 12:13:27'),
(24, 23, 2, 1, 800.00, '2025-12-14 12:13:27', '2025-12-14 12:13:27'),
(25, 24, 1, 1, 500.00, '2025-12-14 12:14:58', '2025-12-14 12:14:58'),
(26, 24, 2, 1, 800.00, '2025-12-14 12:14:58', '2025-12-14 12:14:58'),
(27, 25, 1, 2, 500.00, '2025-12-14 12:51:41', '2025-12-14 12:51:41'),
(28, 25, 2, 2, 800.00, '2025-12-14 12:51:41', '2025-12-14 12:51:41'),
(29, 26, 1, 1, 500.00, '2025-12-14 13:16:50', '2025-12-14 13:16:50'),
(30, 27, 1, 1, 500.00, '2025-12-18 13:36:10', '2025-12-18 13:36:10'),
(31, 27, 2, 2, 800.00, '2025-12-18 13:36:10', '2025-12-18 13:36:10'),
(33, 30, 1, 1, 500.00, '2025-12-18 14:52:18', '2025-12-18 14:52:18'),
(34, 31, 1, 1, 500.00, '2025-12-18 15:06:19', '2025-12-18 15:06:19');

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
-- Table structure for table `payment_transactions`
--

CREATE TABLE `payment_transactions` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `order_id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `payment_gateway` varchar(255) NOT NULL DEFAULT 'razorpay',
  `payment_id` varchar(255) NOT NULL,
  `order_id_gateway` varchar(255) DEFAULT NULL,
  `signature` varchar(255) DEFAULT NULL,
  `amount` decimal(10,2) NOT NULL,
  `gateway_fee` decimal(10,2) NOT NULL DEFAULT 0.00,
  `gst_on_fee` decimal(10,2) NOT NULL DEFAULT 0.00,
  `net_amount` decimal(10,2) NOT NULL,
  `currency` varchar(255) NOT NULL DEFAULT 'INR',
  `status` enum('pending','success','failed','refunded','disputed') NOT NULL DEFAULT 'pending',
  `payment_method` varchar(255) DEFAULT NULL,
  `card_network` varchar(255) DEFAULT NULL,
  `bank` varchar(255) DEFAULT NULL,
  `is_reconciled` tinyint(1) NOT NULL DEFAULT 0,
  `reconciled_at` timestamp NULL DEFAULT NULL,
  `settlement_date` date DEFAULT NULL,
  `settlement_id` varchar(255) DEFAULT NULL,
  `gateway_response` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`gateway_response`)),
  `notes` text DEFAULT NULL,
  `customer_email` varchar(255) DEFAULT NULL,
  `customer_phone` varchar(255) DEFAULT NULL,
  `error_code` varchar(255) DEFAULT NULL,
  `error_description` text DEFAULT NULL,
  `retry_count` int(11) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `payment_transactions`
--

INSERT INTO `payment_transactions` (`id`, `order_id`, `user_id`, `payment_gateway`, `payment_id`, `order_id_gateway`, `signature`, `amount`, `gateway_fee`, `gst_on_fee`, `net_amount`, `currency`, `status`, `payment_method`, `card_network`, `bank`, `is_reconciled`, `reconciled_at`, `settlement_date`, `settlement_id`, `gateway_response`, `notes`, `customer_email`, `customer_phone`, `error_code`, `error_description`, `retry_count`, `created_at`, `updated_at`) VALUES
(1, 24, 2, 'manual', 'manual_24_1765734298', NULL, NULL, 1300.00, 0.00, 0.00, 1300.00, 'INR', 'success', 'upi', NULL, NULL, 0, NULL, NULL, NULL, '{\"type\":\"manual\",\"upi_id\":\"7894561230\",\"payment_method\":\"upi\"}', 'Manual payment - UPI', NULL, '+918770364802', NULL, NULL, 0, '2025-12-14 12:14:58', '2025-12-14 12:14:58'),
(2, 26, 6, 'manual', 'manual_26_1765738010', NULL, NULL, 500.00, 0.00, 0.00, 500.00, 'INR', 'success', 'upi', NULL, NULL, 0, NULL, NULL, NULL, '{\"type\":\"manual\",\"upi_id\":\"42343434142\",\"payment_method\":\"upi\"}', 'Manual payment - UPI', NULL, '924889464', NULL, NULL, 0, '2025-12-14 13:16:50', '2025-12-14 13:16:50'),
(3, 27, 6, 'manual', 'manual_27_1766084770', NULL, NULL, 2100.00, 0.00, 0.00, 2100.00, 'INR', 'success', 'upi', NULL, NULL, 0, NULL, NULL, NULL, '{\"type\":\"manual\",\"upi_id\":\"9303119152@ybl\",\"payment_method\":\"upi\"}', 'Manual payment - UPI', NULL, '9332258484', NULL, NULL, 0, '2025-12-18 13:36:10', '2025-12-18 13:36:10'),
(5, 30, 6, 'razorpay', 'pay_RtCjXYbfovyg0L', 'order_RtCig1JrsT5mr3', '462e0409a1a184d33622987a33abda8eaba8b1d176d65733a753e8d5d1702ff5', 500.00, 10.00, 1.80, 488.20, 'INR', 'success', 'card', 'Visa', NULL, 0, NULL, NULL, NULL, '{\"id\":\"pay_RtCjXYbfovyg0L\",\"entity\":\"payment\",\"amount\":50000,\"currency\":\"INR\",\"status\":\"captured\",\"order_id\":\"order_RtCig1JrsT5mr3\",\"invoice_id\":null,\"international\":false,\"method\":\"card\",\"amount_refunded\":0,\"refund_status\":null,\"captured\":true,\"description\":\"Order Payment\",\"card_id\":\"card_RtCjXk1MBwVEZp\",\"card\":{\"id\":\"card_RtCjXk1MBwVEZp\",\"entity\":\"card\",\"name\":\"\",\"last4\":\"9662\",\"network\":\"Visa\",\"type\":\"debit\",\"issuer\":\"UBIN\",\"international\":false,\"emi\":false,\"sub_type\":\"consumer\",\"token_iin\":null},\"bank\":null,\"wallet\":null,\"vpa\":null,\"email\":\"ajay@gmail.com\",\"contact\":\"+919303119152\",\"token_id\":\"token_RtCjY1kaEOOzAL\",\"notes\":[],\"fee\":1000,\"tax\":0,\"error_code\":null,\"error_description\":null,\"error_source\":null,\"error_step\":null,\"error_reason\":null,\"acquirer_data\":{\"auth_code\":\"150317\"},\"created_at\":1766089289}', NULL, NULL, '9332258484', NULL, NULL, 0, '2025-12-18 14:52:18', '2025-12-18 14:52:18'),
(6, 31, 6, 'manual', 'manual_31_1766090179', NULL, NULL, 500.00, 0.00, 0.00, 500.00, 'INR', 'success', 'upi', NULL, NULL, 0, NULL, NULL, NULL, '{\"type\":\"manual\",\"upi_id\":\"9303119152@ybl\",\"payment_method\":\"upi\"}', 'Manual payment - UPI', NULL, '9332258484', NULL, NULL, 0, '2025-12-18 15:06:19', '2025-12-18 15:06:19');

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
(1, 'App\\Models\\User', 2, 'api-token', 'daaccbc2c93b1a41fbbf5305770681eccd702fffecb3110b6894977163bf99e5', '[\"*\"]', '2025-12-13 01:45:31', NULL, '2025-12-13 01:42:11', '2025-12-13 01:45:31'),
(2, 'App\\Models\\User', 1, 'api-token', '059863ed323bcedb9183a5e287e2e52aaeb9d81b02920b47673a5c40fabf1bc2', '[\"*\"]', '2025-12-13 02:07:17', NULL, '2025-12-13 01:46:16', '2025-12-13 02:07:17'),
(3, 'App\\Models\\User', 4, 'api-token', '9d10b50fb05f30d87b7989b96c1fb85f464ae07b54eb82cb6a3b8a75bbb67d97', '[\"*\"]', '2025-12-14 01:43:26', NULL, '2025-12-13 01:55:09', '2025-12-14 01:43:26'),
(4, 'App\\Models\\User', 1, 'api-token', 'd6d7f7a3564fdfe73f18abd09f96304495e4915e03b2b4a1c857a2ba8de65fdb', '[\"*\"]', '2025-12-13 02:19:29', NULL, '2025-12-13 02:02:26', '2025-12-13 02:19:29'),
(5, 'App\\Models\\User', 2, 'api-token', '5554ef142196ba0997743d3d495436887598155fee49edacea278779bc635819', '[\"*\"]', '2025-12-14 12:11:55', NULL, '2025-12-13 02:07:14', '2025-12-14 12:11:55'),
(6, 'App\\Models\\User', 1, 'api-token', '7342833ab9fcc4274abd4ee699fb7cf2e5bfc2d130c748b800ce9f10360d4d40', '[\"*\"]', '2025-12-13 02:41:57', NULL, '2025-12-13 02:20:02', '2025-12-13 02:41:57'),
(7, 'App\\Models\\User', 1, 'api-token', '3756bbf144fc8289dc7c08722173a906303d099a5594c1af0be63fed8d63b26e', '[\"*\"]', '2025-12-13 02:47:07', NULL, '2025-12-13 02:44:34', '2025-12-13 02:47:07'),
(8, 'App\\Models\\User', 1, 'api-token', 'd80afdf1c9bd0d411c4c12d7649a0f5a4eeabb75aa2735eacff8ab0cf134c193', '[\"*\"]', '2025-12-13 02:50:49', NULL, '2025-12-13 02:47:46', '2025-12-13 02:50:49'),
(9, 'App\\Models\\User', 1, 'api-token', '45f227e38962997024bb38528a68d57307d2d69592784a96e498369fc2bbe1d8', '[\"*\"]', '2025-12-13 03:07:34', NULL, '2025-12-13 02:51:06', '2025-12-13 03:07:34'),
(10, 'App\\Models\\User', 1, 'api-token', '11a1da284b15e82f8a39710ae5b76ad534be6c2e750b9a37b78f1b7941440ef3', '[\"*\"]', '2025-12-14 01:43:24', NULL, '2025-12-13 03:08:03', '2025-12-14 01:43:24'),
(11, 'App\\Models\\User', 1, 'api-token', '9f9e56e40028c76e7b7f2621550fa38d0c43afe3f4fbc1a5de9422b249cbedf8', '[\"*\"]', '2025-12-14 10:15:41', NULL, '2025-12-14 02:46:28', '2025-12-14 10:15:41'),
(12, 'App\\Models\\User', 1, 'api-token', 'a2ffb745207a4aae7bd2c86fe4390196383df84416f06c7237262bc33521befc', '[\"*\"]', '2025-12-14 10:23:45', NULL, '2025-12-14 10:16:07', '2025-12-14 10:23:45'),
(13, 'App\\Models\\User', 1, 'api-token', '401f456c12290534c649dfc858d7b017ba55202537c6599eb35656678fc8f23f', '[\"*\"]', '2025-12-14 10:44:10', NULL, '2025-12-14 10:24:08', '2025-12-14 10:44:10'),
(14, 'App\\Models\\User', 1, 'api-token', '5f2000ae2c2fc772d005a37d09533ad7376ff850087993b70128b5305120edc6', '[\"*\"]', '2025-12-14 12:11:25', NULL, '2025-12-14 11:25:52', '2025-12-14 12:11:25'),
(15, 'App\\Models\\User', 5, 'api-token', 'edab3ee33c5007ce95318139cf9c0cc73f19d5a9246d701aa280cb2cec87fd07', '[\"*\"]', '2025-12-14 12:12:29', NULL, '2025-12-14 12:12:27', '2025-12-14 12:12:29'),
(16, 'App\\Models\\User', 2, 'api-token', '03ab35e09739b1fd7e23508636e9499a6b37b4c102afad20d20445da36e1091a', '[\"*\"]', '2025-12-14 12:49:11', NULL, '2025-12-14 12:14:00', '2025-12-14 12:49:11'),
(17, 'App\\Models\\User', 1, 'api-token', 'f1fe68c0aa6337503b23cf93c99a037b6c47bd4e6eaf60550f0b7c9526550f7f', '[\"*\"]', '2025-12-14 12:28:26', NULL, '2025-12-14 12:15:32', '2025-12-14 12:28:26'),
(18, 'App\\Models\\User', 1, 'api-token', '13e8031d436c4ba00079dce311edbe0c474a655e41f9afe680cdfe53f1a6f177', '[\"*\"]', '2025-12-20 12:49:22', NULL, '2025-12-14 12:28:53', '2025-12-20 12:49:22'),
(19, 'App\\Models\\User', 6, 'api-token', '3c9ed0db418e8560be86ff40cb39e90465e28ead1ca5c08ca2a2bea1e6587abc', '[\"*\"]', '2025-12-14 12:53:52', NULL, '2025-12-14 12:52:35', '2025-12-14 12:53:52'),
(20, 'App\\Models\\User', 7, 'api-token', 'd9da7b64f7186984451814df22388fd81588dbf73d766e9cc49b1879722dd8a1', '[\"*\"]', '2025-12-14 12:58:01', NULL, '2025-12-14 12:57:22', '2025-12-14 12:58:01'),
(21, 'App\\Models\\User', 8, 'api-token', 'e985fd98d0b7798193a1b3b80533815504a257fe4e29d7fec89df304e89458fc', '[\"*\"]', '2025-12-14 13:01:41', NULL, '2025-12-14 13:00:46', '2025-12-14 13:01:41'),
(22, 'App\\Models\\User', 6, 'api-token', '8702656fee632b97c3b887a5cc2069ffc5cac91e21ff51d4675ce6eeb210f7f9', '[\"*\"]', '2025-12-22 13:28:13', NULL, '2025-12-14 13:03:05', '2025-12-22 13:28:13'),
(23, 'App\\Models\\User', 4, 'api-token', '3b3465787a7a8d08485711cc570ad1f7479b681882f9deb3f7a185564668f402', '[\"*\"]', '2025-12-14 13:05:20', NULL, '2025-12-14 13:04:45', '2025-12-14 13:05:20'),
(24, 'App\\Models\\User', 1, 'api-token', 'f2434689f3ca8f11fef10f21f7d17a690f1b482163c0bb25402076b1b6857839', '[\"*\"]', '2025-12-22 13:24:15', NULL, '2025-12-20 12:50:01', '2025-12-22 13:24:15'),
(25, 'App\\Models\\User', 1, 'api-token', 'b28f92fd1a22b1b0e9090eb8e73b481a77db8ceaea73ba3d34ba9f6dacfe50f4', '[\"*\"]', '2025-12-22 13:29:15', NULL, '2025-12-22 13:24:35', '2025-12-22 13:29:15');

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
  `cost_price` decimal(10,2) DEFAULT NULL,
  `mrp` decimal(10,2) DEFAULT NULL,
  `stock` int(11) NOT NULL DEFAULT 0,
  `unit` varchar(255) DEFAULT NULL,
  `unit_value` int(11) DEFAULT 1,
  `inner_unit` varchar(255) DEFAULT NULL,
  `inner_unit_value` int(11) DEFAULT NULL,
  `category_id` bigint(20) UNSIGNED DEFAULT NULL,
  `thumbnail_url` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `title`, `slug`, `description`, `price`, `cost_price`, `mrp`, `stock`, `unit`, `unit_value`, `inner_unit`, `inner_unit_value`, `category_id`, `thumbnail_url`, `created_at`, `updated_at`) VALUES
(1, 'Fireworks Pack A', 'fireworks-pack-a-1', 'Amazing fireworks pack A', 1.00, 300.00, 600.00, 38, NULL, 1, NULL, NULL, 1, 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/BigBuckBunny.jpg', '2025-12-13 01:05:10', '2025-12-18 15:06:19'),
(2, 'Fireworks Pack B', 'fireworks-pack-b-2', 'Great pack B', 800.00, 450.00, 900.00, 21, NULL, 1, NULL, NULL, 2, 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/ElephantsDream.jpg', '2025-12-13 01:05:10', '2025-12-18 13:36:10'),
(3, 'Big Annar', 'big-annar-1766424923', 'Big Annar', 70.00, 40.00, 90.00, 1000, NULL, 1, NULL, NULL, 3, NULL, '2025-12-22 12:05:23', '2025-12-22 12:05:23'),
(4, 'Specail Annar', 'specail-annar-1766424996', 'Specail Annar', 100.00, 60.00, 120.00, 1000, NULL, 1, NULL, NULL, 3, NULL, '2025-12-22 12:06:36', '2025-12-22 12:06:36'),
(5, 'DLX Annar', 'dlx-annar-1766425042', NULL, 200.00, 120.00, 300.00, 500, NULL, 1, NULL, NULL, 3, NULL, '2025-12-22 12:07:22', '2025-12-22 12:07:22'),
(6, 'Big Chakar', 'big-chakar-1766425082', NULL, 60.00, 40.00, 80.00, 500, NULL, 1, NULL, NULL, 4, NULL, '2025-12-22 12:08:02', '2025-12-22 12:08:02'),
(7, 'Special Chakari', 'special-chakari-1766425143', NULL, 100.00, 60.00, 130.00, 500, NULL, 1, NULL, NULL, 4, NULL, '2025-12-22 12:09:03', '2025-12-22 12:09:03'),
(8, 'Fulghadi', 'fulghadi-1766425182', NULL, 40.00, 25.00, 50.00, 500, NULL, 1, NULL, NULL, 5, NULL, '2025-12-22 12:09:42', '2025-12-22 12:09:42'),
(9, '30 Cm fulgadi', '30-cm-fulgadi-9', NULL, 300.00, 120.00, 350.00, 500, 'Unit', 1, 'Piece', 1, 5, NULL, '2025-12-22 12:10:15', '2025-12-22 13:26:32');

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
-- Table structure for table `refunds`
--

CREATE TABLE `refunds` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `order_id` bigint(20) UNSIGNED NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `reason` varchar(255) NOT NULL,
  `images` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`images`)),
  `status` enum('pending','approved','rejected') NOT NULL DEFAULT 'pending',
  `admin_note` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `refunds`
--

INSERT INTO `refunds` (`id`, `order_id`, `amount`, `reason`, `images`, `status`, `admin_note`, `created_at`, `updated_at`) VALUES
(1, 1, 1300.00, 'dddd', '[]', 'approved', NULL, '2025-12-13 02:46:28', '2025-12-13 02:54:40'),
(2, 25, 2600.00, 'DEFICT', '[]', 'rejected', NULL, '2025-12-14 13:06:03', '2025-12-14 13:06:48');

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
('fZhZz3crPVbVP4ZoPfj9ieOd24cwbD9jAXXs9Oiy', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiNWRyNER0R3R4NUx4RGEwcmh5YkFNeUdESHR6NUE5V3QySTNUZktmTCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDI6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9zdHJlYW0vc2FtcGxlLTVzLm1wNCI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1766254630);

-- --------------------------------------------------------

--
-- Table structure for table `settlements`
--

CREATE TABLE `settlements` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `notes` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `settlements`
--

INSERT INTO `settlements` (`id`, `user_id`, `amount`, `notes`, `created_at`, `updated_at`) VALUES
(1, 4, 1295.00, 'vvvvv', '2025-12-13 02:04:28', '2025-12-13 02:04:28'),
(2, 7, 1298.00, 'RECIED', '2025-12-14 12:58:54', '2025-12-14 12:58:54');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `wallet_balance` decimal(10,2) NOT NULL DEFAULT 0.00,
  `phone` varchar(255) DEFAULT NULL,
  `phone_verified_at` timestamp NULL DEFAULT NULL,
  `provider` varchar(255) DEFAULT NULL,
  `provider_id` varchar(255) DEFAULT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `role` varchar(255) NOT NULL DEFAULT 'user',
  `street` varchar(255) DEFAULT NULL,
  `city` varchar(255) DEFAULT NULL,
  `zip` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `wallet_balance`, `phone`, `phone_verified_at`, `provider`, `provider_id`, `email_verified_at`, `password`, `remember_token`, `created_at`, `updated_at`, `role`, `street`, `city`, `zip`) VALUES
(1, 'Test User', 'test@example.com', 0.00, '9999999990', '2025-12-22 13:24:35', NULL, NULL, '2025-12-13 01:04:27', '$2y$12$wqdHLgmE6VzHJnwzB0E3a.skXRaEjOy7NZcsBsyX.0dTHYOZDjAEm', 'NldaAOPkSb', '2025-12-13 01:04:27', '2025-12-22 13:24:35', 'admin', NULL, NULL, NULL),
(2, 'Ajay Kant Kanojiya', NULL, 1300.00, '+918770364802', '2025-12-14 12:14:00', NULL, NULL, NULL, NULL, NULL, '2025-12-13 01:42:11', '2025-12-14 12:14:00', 'user', 'Lalmati Chandmari', 'Jabalpur', '482001'),
(3, 'Delivery boy1', NULL, 0.00, '12345665432', '2025-12-13 01:51:15', NULL, NULL, NULL, NULL, NULL, '2025-12-13 01:51:15', '2025-12-13 01:51:15', 'delivery_boy', NULL, NULL, NULL),
(4, 'Deleviry2', NULL, 0.00, '1234567890', '2025-12-14 13:04:45', NULL, NULL, NULL, NULL, NULL, '2025-12-13 01:51:36', '2025-12-14 13:04:45', 'delivery_boy', NULL, NULL, NULL),
(5, NULL, NULL, 0.00, '99999999990', '2025-12-14 12:12:27', NULL, NULL, NULL, NULL, NULL, '2025-12-14 12:12:27', '2025-12-14 12:12:27', 'user', NULL, NULL, NULL),
(6, 'Ajay', NULL, 0.00, '9332258484', '2025-12-14 13:03:05', NULL, NULL, NULL, NULL, NULL, '2025-12-14 12:52:35', '2025-12-18 13:36:10', 'user', 'noida sector 70', 'noid', '6001'),
(7, 'tarun haldkAR', NULL, 0.00, '8516976461', '2025-12-14 12:57:22', NULL, NULL, NULL, NULL, NULL, '2025-12-14 12:55:13', '2025-12-14 12:57:22', 'delivery_boy', NULL, NULL, NULL),
(8, NULL, NULL, 0.00, '9244889464', '2025-12-14 13:00:46', NULL, NULL, NULL, NULL, NULL, '2025-12-14 13:00:46', '2025-12-14 13:00:46', 'user', NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `user_addresses`
--

CREATE TABLE `user_addresses` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `label` varchar(255) NOT NULL DEFAULT 'Home',
  `name` varchar(255) NOT NULL,
  `phone` varchar(255) NOT NULL,
  `street` varchar(255) NOT NULL,
  `city` varchar(255) NOT NULL,
  `zip` varchar(255) NOT NULL,
  `is_default` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `user_addresses`
--

INSERT INTO `user_addresses` (`id`, `user_id`, `label`, `name`, `phone`, `street`, `city`, `zip`, `is_default`, `created_at`, `updated_at`) VALUES
(1, 6, 'Home', 'Ajay', '9332258484', 'noida sector 70', 'noid', '6001', 1, '2025-12-18 10:31:30', '2025-12-18 10:31:30'),
(2, 6, 'Office', 'ajjju', '424354453463564', 'kanchgar', 'jablapur', '482001', 0, '2025-12-18 10:53:38', '2025-12-18 10:53:38');

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

-- --------------------------------------------------------

--
-- Table structure for table `wallet_transactions`
--

CREATE TABLE `wallet_transactions` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `type` varchar(255) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `wallet_transactions`
--

INSERT INTO `wallet_transactions` (`id`, `user_id`, `amount`, `type`, `description`, `created_at`, `updated_at`) VALUES
(1, 2, 1300.00, 'refund', 'Refund for Order #1', '2025-12-13 02:54:40', '2025-12-13 02:54:40');

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
-- Indexes for table `deliveries`
--
ALTER TABLE `deliveries`
  ADD PRIMARY KEY (`id`),
  ADD KEY `deliveries_order_id_foreign` (`order_id`),
  ADD KEY `deliveries_user_id_foreign` (`user_id`);

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
  ADD KEY `orders_user_id_index` (`user_id`),
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
-- Indexes for table `payment_transactions`
--
ALTER TABLE `payment_transactions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `payment_transactions_payment_id_unique` (`payment_id`),
  ADD KEY `payment_transactions_order_id_foreign` (`order_id`),
  ADD KEY `payment_transactions_user_id_foreign` (`user_id`),
  ADD KEY `payment_transactions_payment_id_index` (`payment_id`),
  ADD KEY `payment_transactions_status_index` (`status`),
  ADD KEY `payment_transactions_settlement_date_index` (`settlement_date`),
  ADD KEY `payment_transactions_is_reconciled_index` (`is_reconciled`),
  ADD KEY `payment_transactions_created_at_index` (`created_at`);

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
-- Indexes for table `refunds`
--
ALTER TABLE `refunds`
  ADD PRIMARY KEY (`id`),
  ADD KEY `refunds_order_id_foreign` (`order_id`);

--
-- Indexes for table `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sessions_user_id_index` (`user_id`),
  ADD KEY `sessions_last_activity_index` (`last_activity`);

--
-- Indexes for table `settlements`
--
ALTER TABLE `settlements`
  ADD PRIMARY KEY (`id`),
  ADD KEY `settlements_user_id_foreign` (`user_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_email_unique` (`email`),
  ADD UNIQUE KEY `users_phone_unique` (`phone`);

--
-- Indexes for table `user_addresses`
--
ALTER TABLE `user_addresses`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_addresses_user_id_foreign` (`user_id`);

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
-- Indexes for table `wallet_transactions`
--
ALTER TABLE `wallet_transactions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `wallet_transactions_user_id_foreign` (`user_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `cart_items`
--
ALTER TABLE `cart_items`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `deliveries`
--
ALTER TABLE `deliveries`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

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
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=38;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=32;

--
-- AUTO_INCREMENT for table `order_items`
--
ALTER TABLE `order_items`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=35;

--
-- AUTO_INCREMENT for table `payment_transactions`
--
ALTER TABLE `payment_transactions`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `product_images`
--
ALTER TABLE `product_images`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `refunds`
--
ALTER TABLE `refunds`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `settlements`
--
ALTER TABLE `settlements`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `user_addresses`
--
ALTER TABLE `user_addresses`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

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
-- AUTO_INCREMENT for table `wallet_transactions`
--
ALTER TABLE `wallet_transactions`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

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
-- Constraints for table `deliveries`
--
ALTER TABLE `deliveries`
  ADD CONSTRAINT `deliveries_order_id_foreign` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `deliveries_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `order_items`
--
ALTER TABLE `order_items`
  ADD CONSTRAINT `order_items_order_id_foreign` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `order_items_product_id_foreign` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `payment_transactions`
--
ALTER TABLE `payment_transactions`
  ADD CONSTRAINT `payment_transactions_order_id_foreign` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `payment_transactions_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

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
-- Constraints for table `refunds`
--
ALTER TABLE `refunds`
  ADD CONSTRAINT `refunds_order_id_foreign` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `settlements`
--
ALTER TABLE `settlements`
  ADD CONSTRAINT `settlements_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `user_addresses`
--
ALTER TABLE `user_addresses`
  ADD CONSTRAINT `user_addresses_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

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

--
-- Constraints for table `wallet_transactions`
--
ALTER TABLE `wallet_transactions`
  ADD CONSTRAINT `wallet_transactions_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
