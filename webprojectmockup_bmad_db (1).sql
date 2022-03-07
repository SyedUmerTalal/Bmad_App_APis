-- phpMyAdmin SQL Dump
-- version 4.9.0.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 02, 2022 at 08:27 AM
-- Server version: 10.4.18-MariaDB
-- PHP Version: 7.3.8

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `webprojectmockup_bmad_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `comments`
--

CREATE TABLE `comments` (
  `comment_id` int(11) NOT NULL,
  `comment_text` text NOT NULL,
  `comment_created_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `comments`
--

INSERT INTO `comments` (`comment_id`, `comment_text`, `comment_created_at`) VALUES
(0, 'Test new comment', '2021-04-08 17:48:57'),
(1, 'Update', '2021-04-07 16:53:29'),
(2, 'NEw comment', '2021-04-08 17:49:16');

-- --------------------------------------------------------

--
-- Table structure for table `comment_user`
--

CREATE TABLE `comment_user` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `sender_id` int(11) NOT NULL,
  `post_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `comment_user`
--

INSERT INTO `comment_user` (`id`, `user_id`, `sender_id`, `post_id`) VALUES
(1, 1, 2, 1);

-- --------------------------------------------------------

--
-- Table structure for table `follower`
--

CREATE TABLE `follower` (
  `follower_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `followed_by` int(11) NOT NULL,
  `status` smallint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `following`
--

CREATE TABLE `following` (
  `following_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `following_to` int(11) NOT NULL,
  `status` smallint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `following`
--

INSERT INTO `following` (`following_id`, `user_id`, `following_to`, `status`) VALUES
(7, 16, 20, 2),
(14, 16, 18, 2),
(18, 16, 17, 1);

-- --------------------------------------------------------

--
-- Table structure for table `interest_by_location`
--

CREATE TABLE `interest_by_location` (
  `id` int(11) NOT NULL,
  `user_id_one` int(11) NOT NULL,
  `user_id_two` int(11) NOT NULL,
  `location_coordinates` varchar(100) DEFAULT NULL,
  `status` smallint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `interest_by_post`
--

CREATE TABLE `interest_by_post` (
  `id` int(11) NOT NULL,
  `user_id_one` int(11) NOT NULL,
  `user_id_two` int(11) NOT NULL,
  `post_id` int(11) NOT NULL,
  `status` smallint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `likes`
--

CREATE TABLE `likes` (
  `likes_id` int(11) NOT NULL,
  `post_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `generated_by` int(11) NOT NULL,
  `generated_at` datetime NOT NULL DEFAULT current_timestamp(),
  `like_status` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `likes`
--

INSERT INTO `likes` (`likes_id`, `post_id`, `user_id`, `generated_by`, `generated_at`, `like_status`) VALUES
(1, 1, 1, 2, '2021-04-07 14:16:25', 0),
(2, 1, 1, 3, '2021-04-07 14:24:39', 1);

-- --------------------------------------------------------

--
-- Table structure for table `login`
--

CREATE TABLE `login` (
  `user_name` varchar(20) NOT NULL,
  `password` varchar(20) NOT NULL,
  `login_with` varchar(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `post`
--

CREATE TABLE `post` (
  `post_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `post_title` varchar(80) DEFAULT NULL,
  `post_url` text DEFAULT NULL,
  `post_desc` text DEFAULT NULL,
  `post_type` enum('video','text','image','audio') NOT NULL,
  `post_status` smallint(1) NOT NULL DEFAULT 1,
  `post_created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `post_updated_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `post`
--

INSERT INTO `post` (`post_id`, `user_id`, `post_title`, `post_url`, `post_desc`, `post_type`, `post_status`, `post_created_at`, `post_updated_at`) VALUES
(1, 1, 'Not', 'http://localhost:5000/post_file/post_file_1617779113011.mp4', 'Post description', 'video', 1, '2021-04-07 11:41:58', '2021-04-07 11:41:58'),
(2, 1, 'Rotating earth', 'http://localhost:5000/post_file/post_file_1617777734038.mp4', 'Post description', 'video', 1, '2021-04-07 11:42:14', '2021-04-07 11:42:14'),
(3, 1, 'Rotating earth', 'http://localhost:5000/post_file/post_file_1617777768294.wav', 'Post description', 'audio', 1, '2021-04-07 11:42:48', '2021-04-07 11:42:48'),
(4, 1, 'Rotating earth', 'http://localhost:5000/post_file/post_file_1617777941307.wav', 'Post description', 'audio', 1, '2021-04-07 11:45:41', '2021-04-07 11:45:41'),
(5, 1, 'Rotating earth', 'http://localhost:5000/post_file/post_file_1617778005675.wav', 'Post description', 'audio', 1, '2021-04-07 11:46:45', '2021-04-07 11:46:45'),
(6, 1, 'Rotating earth', 'http://localhost:5000/post_file/post_file_1617778017798.png', 'Post description', 'image', 1, '2021-04-07 11:46:57', '2021-04-07 11:46:57'),
(9, 1, 'New post by me', 'http://localhost:5000/post_file/post_file_1617779425704.mp4', 'Post description', 'video', 1, '2021-04-07 12:10:25', '2021-04-07 12:10:25'),
(45, 1, 'Nikal', '[\"http://localhost:5000/post_file/post_file_1626173954359.png\",\"http://localhost:5000/post_file/post_file_1626173954373.png\",\"http://localhost:5000/post_file/post_file_1626173954386.png\"]', 'this is test', 'image', 1, '2021-07-13 15:59:14', '2021-07-13 15:59:14'),
(46, 1, 'ahsan', '[\"http://localhost:5000/post_file/post_file_1626174042929.JPG\",\"http://localhost:5000/post_file/post_file_1626174042930.JPG\",\"http://localhost:5000/post_file/post_file_1626174042931.JPG\",\"http://localhost:5000/post_file/post_file_1626174042932.JPG\",\"http://localhost:5000/post_file/post_file_1626174042932.JPG\",\"http://localhost:5000/post_file/post_file_1626174042933.png\"]', 'this is test', 'image', 1, '2021-07-13 16:00:42', '2021-07-13 16:00:42'),
(47, 12, 'ahsan', '[\"http://localhost:5000/post_file/post_file_1626174888856.JPG\",\"http://localhost:5000/post_file/post_file_1626174888858.JPG\",\"http://localhost:5000/post_file/post_file_1626174888859.JPG\",\"http://localhost:5000/post_file/post_file_1626174888860.JPG\"]', 'this is test', 'image', 1, '2021-07-13 16:14:48', '2021-07-13 16:14:48'),
(48, 12, 'ahsan', '[\"http://localhost:5000/post_file/post_file_1626327276100.JPG\",\"http://localhost:5000/post_file/post_file_1626327285948.JPG\",\"http://localhost:5000/post_file/post_file_1626327297725.JPG\",\"http://localhost:5000/post_file/post_file_1626327308167.JPG\"]', 'this is test', 'image', 1, '2021-07-15 01:35:15', '2021-07-15 01:35:15'),
(49, 34, 'ahsan', '[\"http://localhost:5000/post_file/post_file_1626327328567.JPG\",\"http://localhost:5000/post_file/post_file_1626327336668.JPG\",\"http://localhost:5000/post_file/post_file_1626327345803.JPG\",\"http://localhost:5000/post_file/post_file_1626327359472.JPG\"]', 'this is test', 'image', 1, '2021-07-15 01:36:15', '2021-07-15 01:36:15'),
(50, 34, 'ahsan', 'http://localhost:5000/post_file/post_file_1626327466233.png', 'this is test', 'image', 1, '2021-07-15 01:37:46', '2021-07-15 01:37:46'),
(51, 34, 'ahsan', 'http://webprojectmockup.com:9448/post_file/post_file_1627362483563.png', 'this is test', 'image', 1, '2021-07-27 01:08:03', '2021-07-27 01:08:03'),
(52, 34, 'ahsan', 'http://webprojectmockup.com:9448/post_file/post_file_1627362592388.png', 'this is test', 'image', 1, '2021-07-27 01:09:52', '2021-07-27 01:09:52'),
(53, 34, 'ahsan', 'http://webprojectmockup.com:9448/post_file/post_file_1627362623632.png', 'this is test', 'image', 1, '2021-07-27 01:10:23', '2021-07-27 01:10:23'),
(54, 16, 'umer', 'https://600e-110-93-244-255.ngrok.io/post_file/post_file_1644591321574.PNG', 'okay creat ', 'image', 1, '2022-02-11 19:55:27', '2022-02-11 19:55:27'),
(55, 16, 'umer', 'https://600e-110-93-244-255.ngrok.io/post_file/post_file_1644591357145.PNG', 'okay creat ', 'image', 1, '2022-02-11 19:56:02', '2022-02-11 19:56:02'),
(56, 16, 'umer', 'https://600e-110-93-244-255.ngrok.io/post_file/post_file_1644591404184.PNG', 'okay creat ', 'image', 1, '2022-02-11 19:56:50', '2022-02-11 19:56:50'),
(57, 16, 'umer', 'https://600e-110-93-244-255.ngrok.io/post_file/post_file_1644591445392.PNG', 'okay creat ', 'image', 1, '2022-02-11 19:57:31', '2022-02-11 19:57:31'),
(58, 16, 'umer', 'https://600e-110-93-244-255.ngrok.io/post_file/post_file_1646127290330.PNG', 'okay creat ', 'image', 1, '2022-03-01 14:34:55', '2022-03-01 14:34:55'),
(59, 16, 'umer', 'https://3a9b-103-244-176-173.ngrok.io/post_file/post_file_1646127357572.PNG', 'okay creat ', 'image', 1, '2022-03-01 14:36:02', '2022-03-01 14:36:02'),
(60, 16, 'umer', 'https://3a9b-103-244-176-173.ngrok.io/post_file/post_file_1646127448312.jpg', 'okay creat ', 'image', 1, '2022-03-01 14:37:28', '2022-03-01 14:37:28'),
(61, 16, 'umer', '[\"https://3a9b-103-244-176-173.ngrok.io/post_file/post_file_1646127583189.jpg\",\"https://3a9b-103-244-176-173.ngrok.io/post_file/post_file_1646127584009.jpg\"]', 'okay creat ', 'image', 1, '2022-03-01 14:39:44', '2022-03-01 14:39:44'),
(62, 16, 'umer', 'umer', NULL, '', 1, '2022-03-01 15:24:39', '2022-03-01 15:24:39'),
(63, 16, 'u', 'm', 'r', '', 1, '2022-03-01 15:25:55', '2022-03-01 15:25:55'),
(64, 16, 'multi tag', 'umer', NULL, '', 1, '2022-03-01 15:27:49', '2022-03-01 15:27:49'),
(65, 16, 'umer', '[\"https://3a9b-103-244-176-173.ngrok.io/post_file/post_file_1646130515832.jpg\",\"https://3a9b-103-244-176-173.ngrok.io/post_file/post_file_1646130516480.jpg\"]', 'okay creat ', 'image', 1, '2022-03-01 15:28:36', '2022-03-01 15:28:36'),
(66, 16, 'm', 'u', 't', '', 1, '2022-03-01 15:29:13', '2022-03-01 15:29:13'),
(67, 16, 'multi tag', 'https://3a9b-103-244-176-173.ngrok.io/post_file/post_file_1646130600788.PNG', 'okay creat ', 'image', 1, '2022-03-01 15:30:05', '2022-03-01 15:30:05'),
(68, 16, '[\"ahsan\", \"muneer\"]', 'https://3a9b-103-244-176-173.ngrok.io/post_file/post_file_1646130673747.PNG', 'okay creat ', 'image', 1, '2022-03-01 15:31:18', '2022-03-01 15:31:18'),
(69, 16, '[\"ahsan\", \"muneer\"]', 'https://3a9b-103-244-176-173.ngrok.io/post_file/post_file_1646130681765.PNG', 'okay creat ', 'image', 1, '2022-03-01 15:31:26', '2022-03-01 15:31:26'),
(70, 16, 'umer', '[\"https://3a9b-103-244-176-173.ngrok.io/post_file/post_file_1646133863221.jpg\"]', 'okay creat ', 'image', 1, '2022-03-01 16:24:23', '2022-03-01 16:24:23'),
(71, 16, '[\"ahsan\", \"muneer\"]', 'https://3a9b-103-244-176-173.ngrok.io/post_file/post_file_1646134390331.PNG', 'okay creat ', 'image', 1, '2022-03-01 16:33:13', '2022-03-01 16:33:13'),
(72, 16, '[\"ahsan\", \"muneer\"]', 'https://3a9b-103-244-176-173.ngrok.io/post_file/post_file_1646134479259.PNG', 'okay creat ', 'image', 1, '2022-03-01 16:34:43', '2022-03-01 16:34:43'),
(73, 16, '[\"ahsan\", \"muneer\"]', 'https://3a9b-103-244-176-173.ngrok.io/post_file/post_file_1646134501481.PNG', 'okay creat ', 'image', 1, '2022-03-01 16:35:06', '2022-03-01 16:35:06'),
(74, 16, 'umer', '[\"https://3a9b-103-244-176-173.ngrok.io/post_file/post_file_1646134510225.jpg\"]', 'okay creat ', 'image', 1, '2022-03-01 16:35:10', '2022-03-01 16:35:10'),
(75, 16, 'umer', '[\"https://3a9b-103-244-176-173.ngrok.io/post_file/post_file_1646134646136.jpg\"]', 'okay creat ', 'image', 1, '2022-03-01 16:37:26', '2022-03-01 16:37:26'),
(76, 16, NULL, '[]', '', 'text', 1, '2022-03-01 16:38:46', '2022-03-01 16:38:46'),
(77, 16, 'umer', '[\"https://3a9b-103-244-176-173.ngrok.io/post_file/post_file_1646134831518.jpg\"]', 'okay creat ', 'image', 1, '2022-03-01 16:40:31', '2022-03-01 16:40:31'),
(78, 16, 'umer', '[\"https://3a9b-103-244-176-173.ngrok.io/post_file/post_file_1646134838703.jpg\"]', 'okay creat ', 'image', 1, '2022-03-01 16:40:39', '2022-03-01 16:40:39'),
(79, 16, 'umer', '[\"https://3a9b-103-244-176-173.ngrok.io/post_file/post_file_1646134847232.jpg\"]', 'okay creat ', 'image', 1, '2022-03-01 16:40:49', '2022-03-01 16:40:49'),
(80, 16, 'umer', '[\"https://3a9b-103-244-176-173.ngrok.io/post_file/post_file_1646134857007.jpg\"]', 'okay creat ', 'image', 1, '2022-03-01 16:40:57', '2022-03-01 16:40:57'),
(81, 16, '[\"ASDASD\"]', '[\"https://3a9b-103-244-176-173.ngrok.io/post_file/post_file_1646134915492.jpg\"]', 'okay creat ', 'image', 1, '2022-03-01 16:41:55', '2022-03-01 16:41:55'),
(82, 16, '[\"ASDASD\"]', '[\"https://3a9b-103-244-176-173.ngrok.io/post_file/post_file_1646135222348.jpg\"]', 'okay creat ', 'image', 1, '2022-03-01 16:47:02', '2022-03-01 16:47:02'),
(83, 16, '[\"ASDASD\"]', '[\"https://3a9b-103-244-176-173.ngrok.io/post_file/post_file_1646135376147.jpg\"]', 'okay creat ', 'image', 1, '2022-03-01 16:49:36', '2022-03-01 16:49:36'),
(84, 16, '[\"ASDASD\"]', '[\"https://3a9b-103-244-176-173.ngrok.io/post_file/post_file_1646135380321.jpg\"]', 'okay creat ', 'image', 1, '2022-03-01 16:49:40', '2022-03-01 16:49:40'),
(85, 16, '[\"ASDASD\"]', '[\"https://3a9b-103-244-176-173.ngrok.io/post_file/post_file_1646135381918.jpg\"]', 'okay creat ', 'image', 1, '2022-03-01 16:49:41', '2022-03-01 16:49:41'),
(86, 16, '[\"ASDASD\"]', '[\"https://3a9b-103-244-176-173.ngrok.io/post_file/post_file_1646135382646.jpg\"]', 'okay creat ', 'image', 1, '2022-03-01 16:49:42', '2022-03-01 16:49:42'),
(87, 16, '[\"ASDASD\"]', '[\"https://3a9b-103-244-176-173.ngrok.io/post_file/post_file_1646135383339.jpg\"]', 'okay creat ', 'image', 1, '2022-03-01 16:49:43', '2022-03-01 16:49:43'),
(88, 16, '[\"ASDASD\"]', '[\"https://3a9b-103-244-176-173.ngrok.io/post_file/post_file_1646135433934.jpg\"]', 'okay creat ', 'image', 1, '2022-03-01 16:50:33', '2022-03-01 16:50:33'),
(89, 16, '[\"ASDASD\"]', '[\"https://3a9b-103-244-176-173.ngrok.io/post_file/post_file_1646135435120.jpg\"]', 'okay creat ', 'image', 1, '2022-03-01 16:50:35', '2022-03-01 16:50:35'),
(90, 16, '[\"ASDASD\"]', '[]', 'okay creat ', 'text', 1, '2022-03-01 16:56:02', '2022-03-01 16:56:02'),
(91, 16, '[\"ASDASD\"]', '[\"https://3a9b-103-244-176-173.ngrok.io/post_file/post_file_1646135783358.jpg\"]', 'okay creat ', 'image', 1, '2022-03-01 16:56:23', '2022-03-01 16:56:23'),
(92, 16, '[\"ASDASD\"]', '[\"https://3a9b-103-244-176-173.ngrok.io/post_file/post_file_1646135784555.jpg\"]', 'okay creat ', 'image', 1, '2022-03-01 16:56:24', '2022-03-01 16:56:24'),
(93, 16, '[\"ASDASD\"]', '[\"https://3a9b-103-244-176-173.ngrok.io/post_file/post_file_1646135785325.jpg\"]', 'okay creat ', 'image', 1, '2022-03-01 16:56:25', '2022-03-01 16:56:25'),
(94, 16, '[\"ASDASD\"]', '[\"https://3a9b-103-244-176-173.ngrok.io/post_file/post_file_1646135785655.jpg\"]', 'okay creat ', 'image', 1, '2022-03-01 16:56:25', '2022-03-01 16:56:25'),
(95, 16, '[\"ASDASD\"]', '[\"https://3a9b-103-244-176-173.ngrok.io/post_file/post_file_1646135785983.jpg\"]', 'okay creat ', 'image', 1, '2022-03-01 16:56:25', '2022-03-01 16:56:25'),
(96, 16, 'ASDASD', '[]', 'ASASDASD', 'text', 1, '2022-03-01 16:57:04', '2022-03-01 16:57:04'),
(97, 16, '[\"ASDASD\"]', '[]', 'okay creat ', 'text', 1, '2022-03-01 16:58:58', '2022-03-01 16:58:58'),
(98, 16, NULL, '[]', 'dsadasda', 'text', 1, '2022-03-01 16:59:18', '2022-03-01 16:59:18'),
(99, 16, '[\"ASDASD\"]', '[\"https://3a9b-103-244-176-173.ngrok.io/post_file/post_file_1646135985995.jpg\"]', 'okay creat ', 'image', 1, '2022-03-01 16:59:45', '2022-03-01 16:59:45'),
(100, 16, 'tags', '[]', 'sadasdasd', 'text', 1, '2022-03-01 17:00:00', '2022-03-01 17:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `user_id` int(11) NOT NULL,
  `social_login` varchar(100) NOT NULL,
  `user_name` varchar(100) NOT NULL,
  `user_email` varchar(100) NOT NULL,
  `user_password` varchar(100) NOT NULL,
  `user_address` varchar(100) DEFAULT NULL,
  `user_contact` varchar(50) NOT NULL,
  `user_reg_verify_code` varchar(50) NOT NULL,
  `user_status` smallint(1) NOT NULL DEFAULT 1,
  `user_created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `user_updated_at` datetime NOT NULL DEFAULT current_timestamp(),
  `login_status` int(2) NOT NULL DEFAULT 0,
  `user_image` text DEFAULT NULL,
  `user_gender` varchar(20) NOT NULL,
  `user_interest` varchar(100) NOT NULL,
  `user_favorite` varchar(100) NOT NULL,
  `user_gender_interest` varchar(100) NOT NULL,
  `user_longitude` varchar(100) DEFAULT NULL,
  `user_latitude` varchar(100) DEFAULT NULL,
  `user_title` varchar(100) DEFAULT NULL,
  `user_bio` varchar(100) DEFAULT NULL,
  `user_lives` varchar(100) DEFAULT NULL,
  `user_coverImage` text DEFAULT NULL,
  `user_relation` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`user_id`, `social_login`, `user_name`, `user_email`, `user_password`, `user_address`, `user_contact`, `user_reg_verify_code`, `user_status`, `user_created_at`, `user_updated_at`, `login_status`, `user_image`, `user_gender`, `user_interest`, `user_favorite`, `user_gender_interest`, `user_longitude`, `user_latitude`, `user_title`, `user_bio`, `user_lives`, `user_coverImage`, `user_relation`) VALUES
(16, '[\'fb\']', 'umer', 'ahsanmuneer@gmail.com', 'ahsan12345', 'Suite # 102, First Floor, Building No. 21-C, Haryani Square, Bukhari Commercial Lane-10, Phase-VI, D', '+923242422072', '4353', 1, '2021-06-08 22:20:30', '2021-06-08 22:20:30', 0, 'https://600e-110-93-244-255.ngrok.io/post_file/post_file_1644589499983.PNG', 'male', '[\"Tech\",\"Food\",\"Art & Design\",\"Movie\"]', '[\"Old Fashioned\",\"Dark & Stormy\",\"Manhattan\",\"Whiskey Sour\",\"Mimosa\",\"Margarita\"]', '[\"Male\",\"Female\"]', '67.0665601', '24.7931192', 'Software Engineer', 'Software Engineer PHP developer', 'Pakistan', 'https://600e-110-93-244-255.ngrok.io/post_file/post_file_1644589500414.PNG', 'mingle '),
(17, 'USER_AUTH', 'Ahsan req', 'ahsanmuneer0@gmail.com', 'ahsan12345', '', '+923488300016', '4353', 1, '2021-06-17 23:26:56', '2021-06-17 23:26:56', 0, 'https://avatars.githubusercontent.com/u/94114381?s=400&u=ca216f6dcab2e49dfa4500910a8144bd4d03b3f2&v=4', 'male', '[\"Tech\",\"Food\",\"Art & Design\",\"Movie\"]', '[\"Old Fashioned\",\"Dark & Stormy\",\"Manhattan\",\"Whiskey Sour\",\"Mimosa\",\"Margarita\"]', '[\"Male\",\"Female\"]', '67.063902', '24.7955933', '', '', '', '', ''),
(18, 'USER_AUTH', 'Ahsan Muneer', 'ahsanmuneer1@gmail.com', 'ahsan12345', '', '+923488300016', '4353', 1, '2021-06-17 23:42:24', '2021-06-17 23:42:24', 0, 'https://avatars.githubusercontent.com/u/94114381?s=400&u=ca216f6dcab2e49dfa4500910a8144bd4d03b3f2&v=4', 'male', '[\"Tech\",\"Food\",\"Art & Design\",\"Movie\"]', '[\"Old Fashioned\",\"Dark & Stormy\",\"Manhattan\",\"Whiskey Sour\",\"Mimosa\",\"Margarita\"]', '[\"Male\",\"Female\"]', '67.0646289', '24.795038', '', '', '', '', ''),
(19, 'USER_AUTH', 'Ahsan Muneer', 'ahsanmuneer2@gmail.com', 'ahsan12345', '', '+923488300016', '4353', 1, '2021-06-17 23:42:51', '2021-06-17 23:42:51', 0, 'https://avatars.githubusercontent.com/u/94114381?s=400&u=ca216f6dcab2e49dfa4500910a8144bd4d03b3f2&v=4', 'male', '[\"Tech\",\"Food\",\"Art & Design\",\"Movie\"]', '[\"Old Fashioned\",\"Dark & Stormy\",\"Manhattan\",\"Whiskey Sour\",\"Mimosa\",\"Margarita\"]', '[\"Male\",\"Female\"]', '67.0623128', '24.7936581', '', '', '', '', ''),
(20, 'USER_AUTH', 'Ahsan Muneer', 'ahsanmuneer3@gmail.com', 'ahsan12345', '', '+923488300016', '4353', 1, '2021-06-17 23:48:09', '2021-06-17 23:48:09', 0, 'https://indianmemetemplates.com/wp-content/uploads/aapne-ghabrana-nahi-hai-1024x575.jpg', 'male', '[\"Tech\",\"Food\",\"Art & Design\",\"Movie\"]', '[\"Old Fashioned\",\"Dark & Stormy\",\"Manhattan\",\"Whiskey Sour\",\"Mimosa\",\"Margarita\"]', '[\"Male\",\"Female\"]', '67.0623128', '24.7936581', '', '', '', '', ''),
(21, 'USER_AUTH', 'Ahsan Muneer', 'ahsanmuneer4@gmail.com', 'ahsan12345', '', '+923488300016', '4353', 1, '2021-06-17 23:48:47', '2021-06-17 23:48:47', 0, 'https://static.toiimg.com/thumb/msid-72121717,width-1200,height-900,resizemode-4/.jpg', 'male', '[\"Tech\",\"Food\",\"Art & Design\",\"Movie\"]', '[\"Old Fashioned\",\"Dark & Stormy\",\"Manhattan\",\"Whiskey Sour\",\"Mimosa\",\"Margarita\"]', '[\"Male\",\"Female\"]', '67.0633052', '24.795038', '', '', '', '', ''),
(22, 'USER_AUTH', 'Ahsan Muneer', 'ahsanmuneer5@gmail.com', 'ahsan12345', '', '+923488300016', '4353', 1, '2021-06-17 23:48:57', '2021-06-17 23:48:57', 0, 'https://static.toiimg.com/thumb/msid-72121717,width-1200,height-900,resizemode-4/.jpg', 'male', '[\"Tech\",\"Food\",\"Art & Design\",\"Movie\"]', '[\"Old Fashioned\",\"Dark & Stormy\",\"Manhattan\",\"Whiskey Sour\",\"Mimosa\",\"Margarita\"]', '[\"Male\",\"Female\"]', '62.342142', '24.321312', '', '', '', '', ''),
(23, 'USER_AUTH', 'Ahsan Muneer', 'ahsanmuneer6@gmail.com', 'ahsan12345', '', '+923488300016', '4353', 1, '2021-06-17 23:49:31', '2021-06-17 23:49:31', 0, 'https://static.toiimg.com/thumb/msid-72121717,width-1200,height-900,resizemode-4/.jpg', 'male', '[\"Tech\",\"Food\",\"Art & Design\",\"Movie\"]', '[\"Old Fashioned\",\"Dark & Stormy\",\"Manhattan\",\"Whiskey Sour\",\"Mimosa\",\"Margarita\"]', '[\"Male\",\"Female\"]', '62.342142', '24.321312', '', '', '', '', ''),
(24, 'USER_AUTH', 'Ahsan Muneer', 'ahsanmuneer7@gmail.com', 'ahsan12345', '', '+923488300016', '4353', 1, '2021-06-17 23:49:42', '2021-06-17 23:49:42', 0, 'https://static.toiimg.com/thumb/msid-72121717,width-1200,height-900,resizemode-4/.jpg', 'male', '[\"Tech\",\"Food\",\"Art & Design\",\"Movie\"]', '[\"Old Fashioned\",\"Dark & Stormy\",\"Manhattan\",\"Whiskey Sour\",\"Mimosa\",\"Margarita\"]', '[\"Male\",\"Female\"]', '62.342142', '24.321312', '', '', '', '', ''),
(25, 'USER_AUTH', 'Ahsan Muneer', 'ahsanmuneer8@gmail.com', 'ahsan12345', '', '+923488300016', '4353', 1, '2021-06-17 23:54:05', '2021-06-17 23:54:05', 0, 'https://static.toiimg.com/thumb/msid-72121717,width-1200,height-900,resizemode-4/.jpg', 'male', '[\"Tech\",\"Food\",\"Art & Design\",\"Movie\"]', '[\"Old Fashioned\",\"Dark & Stormy\",\"Manhattan\",\"Whiskey Sour\",\"Mimosa\",\"Margarita\"]', '[\"Male\",\"Female\"]', '62.342142', '24.321312', '', '', '', '', ''),
(26, 'USER_AUTH', 'ahsanmuneer81', 'ahsanmuneer11@gmail.com', '123456', '', '923488300016', '4616', 1, '2021-06-18 00:48:46', '2021-06-18 00:48:46', 0, 'https://indianmemetemplates.com/wp-content/uploads/aapne-ghabrana-nahi-hai-1024x575.jpg', 'female', '[\"Tech\",\"Food\",\"Art & Design\",\"Movie\"]', '[\"Old Fashioned\",\"Dark & Stormy\",\"Manhattan\",\"Whiskey Sour\",\"Mimosa\",\"Margarita\"]', '[\"Male\",\"Female\"]', '62.342142', '24.321312', '', 'https://249c-110-93-244-255.ngrok.io', '', '', ''),
(27, 'USER_AUTH', 'ahsanmuneer11', 'ahsanmuneer123@gmail.com', '123456', '', '923488300016', '4233', 1, '2021-06-18 02:56:50', '2021-06-18 02:56:50', 0, 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/User_icon_2.svg/640px-User_icon_2.svg.png', 'male', '[\"Tech\",\"Food\",\"Art & Design\",\"Movie\"]', '[\"Old Fashioned\",\"Margarita\",\"Mimosa\",\"Whiskey Sour\"]', '[\"Male\",\"Female\"]', '62.342142', '24.321312', '', '', '', '', ''),
(28, 'USER_AUTH', 'ahsanmuneer12345', 'ahsanmuneer1234@gmail.com', '123456', '', '923488300016', '3451', 1, '2021-06-18 03:13:11', '2021-06-18 03:13:11', 0, 'https://indianmemetemplates.com/wp-content/uploads/aapne-ghabrana-nahi-hai-1024x575.jpg', 'male', '[\"Tech\",\"Food\",\"Art & Design\",\"Movie\",\"Tech\",\"Food\",\"Art & Design\",\"Movie\"]', '[\"Old Fashioned\",\"Margarita\",\"Mimosa\",\"Whiskey Sour\",\"Old Fashioned\",\"Margarita\",\"Mimosa\"]', '[\"Male\",\"Female\"]', '62.342142', '24.321312', '', '', '', '', ''),
(34, 'USER_AUTH', 'Mohammad Ahsan Muneer', 'ahsanmuneer50@gmail.com', 'ahsan12345', 'R-659 15-A/4 Bufferzone', '+923488300016', '4353', 1, '2021-07-15 01:21:39', '2021-07-15 01:21:39', 0, 'https://indianmemetemplates.com/wp-content/uploads/aapne-ghabrana-nahi-hai-1024x575.jpg', 'male', '[\"Tech\",\"Food\",\"Art & Design\",\"Movie\"]', '[\"Old Fashioned\",\"Dark & Stormy\",\"Manhattan\",\"Whiskey Sour\",\"Mimosa\",\"Margarita\"]', '[\"Male\",\"Female\"]', '61.000000', '21.00000', 'Software Engineer', 'https://249c-110-93-244-255.ngrok.io', 'Karachi', 'http://webprojectmockup.com:9448/post_file/post_file_1626422731030.png', 'Single'),
(35, 'USER_AUTH', 'Ghlgugu', 'abcd@gmail.com', '123456', NULL, '923488300016', '7625', 1, '2021-10-22 06:23:17', '2021-10-22 06:23:17', 0, 'https://indianmemetemplates.com/wp-content/uploads/aapne-ghabrana-nahi-hai-1024x575.jpg', 'male', '[\"Art & Design\",\"Book\"]', '[\"Margarita\",\"Mimosa\",\"Whiskey Sour\"]', '[\"Male\",\"Female\"]', '67.0651', '24.7931', NULL, NULL, NULL, NULL, NULL),
(36, 'USER_AUTH', 'Asad', 'asadsiddiq07@gmail.com', 'Abcd1234', NULL, '923330219038', '3136', 1, '2021-10-22 13:11:46', '2021-10-22 13:11:46', 0, 'https://indianmemetemplates.com/wp-content/uploads/aapne-ghabrana-nahi-hai-1024x575.jpg', 'male', '[\"Food\"]', '[\"Margarita\"]', '[\"Male\",\"Female\"]', '67.0651', '24.7931', NULL, NULL, NULL, NULL, NULL),
(37, 'USER_AUTH', 'ahsan', 'ahsanmunir@gmail.com', '123456', NULL, '923492422072', '2313', 1, '2022-02-08 16:39:31', '2022-02-08 16:39:31', 0, 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/User_icon_2.svg/640px-User_icon_2.svg.png', 'female', '[\"Tech\",\"Food\",\"Book\",\"Movie\"]', '[\"Old Fashioned\",\"Dark & Stormy\",\"Manhattan\",\"Whiskey Sour\",\"Mimosa\",\"Margarita\"]', '[\"Male\",\"Female\"]', '67.0651', '24.7931', NULL, NULL, NULL, NULL, NULL),
(38, 'USER_AUTH', 'ahsan', 'ahsan12345@gmail.com', 'ahsan12345', NULL, '923232656608', '9181', 1, '2022-02-11 21:28:50', '2022-02-11 21:28:50', 0, NULL, 'female', '[\"Food\",\"Tech\",\"Animal\",\"Art&Design\",\"Book\",\"Movie\",\"Poetry\",\"Nature\"]', '[\"Old Fashioned\",\"Margarita\",\"Dark & Stormy\",\"Mimosa\",\"Manhattan\",\"Whiskey Sour\",\"Cosmopolitan\",\"Mar', '[\"Male\",\"Female\"]', '62.342142', '24.321312', NULL, NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `user_comments`
--

CREATE TABLE `user_comments` (
  `id` int(10) UNSIGNED NOT NULL,
  `user_id` int(11) NOT NULL,
  `post_id` int(11) NOT NULL,
  `comment` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `user_comments`
--

INSERT INTO `user_comments` (`id`, `user_id`, `post_id`, `comment`) VALUES
(1, 1, 1, 'Here is the comment posted by userId1 and also post id 1'),
(2, 1, 1, 'Here is the comment posted by userId1 and also post id 1'),
(3, 1, 1, 'other comment posted by userId1 and also post id 1'),
(4, 2, 1, 'other comment posted by userId1 and also post id 1'),
(5, 1, 2, 'Here is the comment posted by userId1 and also post id 1');

-- --------------------------------------------------------

--
-- Table structure for table `user_likes`
--

CREATE TABLE `user_likes` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `like_by` int(11) NOT NULL,
  `like_created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `comments`
--
ALTER TABLE `comments`
  ADD PRIMARY KEY (`comment_id`);

--
-- Indexes for table `comment_user`
--
ALTER TABLE `comment_user`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `follower`
--
ALTER TABLE `follower`
  ADD PRIMARY KEY (`follower_id`),
  ADD UNIQUE KEY `Unique_follower` (`user_id`,`followed_by`);

--
-- Indexes for table `following`
--
ALTER TABLE `following`
  ADD PRIMARY KEY (`following_id`),
  ADD UNIQUE KEY `unique` (`user_id`,`following_to`);

--
-- Indexes for table `interest_by_location`
--
ALTER TABLE `interest_by_location`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `interest_by_post`
--
ALTER TABLE `interest_by_post`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `likes`
--
ALTER TABLE `likes`
  ADD PRIMARY KEY (`likes_id`),
  ADD UNIQUE KEY `Unique Like` (`post_id`,`generated_by`);

--
-- Indexes for table `post`
--
ALTER TABLE `post`
  ADD PRIMARY KEY (`post_id`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`user_id`);

--
-- Indexes for table `user_comments`
--
ALTER TABLE `user_comments`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user_likes`
--
ALTER TABLE `user_likes`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `comment_user`
--
ALTER TABLE `comment_user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `follower`
--
ALTER TABLE `follower`
  MODIFY `follower_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `following`
--
ALTER TABLE `following`
  MODIFY `following_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `interest_by_location`
--
ALTER TABLE `interest_by_location`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `interest_by_post`
--
ALTER TABLE `interest_by_post`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `likes`
--
ALTER TABLE `likes`
  MODIFY `likes_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `post`
--
ALTER TABLE `post`
  MODIFY `post_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=101;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=39;

--
-- AUTO_INCREMENT for table `user_comments`
--
ALTER TABLE `user_comments`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `user_likes`
--
ALTER TABLE `user_likes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
