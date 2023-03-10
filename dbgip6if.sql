-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Gegenereerd op: 06 mrt 2023 om 13:25
-- Serverversie: 10.4.24-MariaDB
-- PHP-versie: 7.4.26

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `dbgip6if`
--

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `tbladvertisements`
--

DROP TABLE IF EXISTS `tbladvertisements`;
CREATE TABLE IF NOT EXISTS `tbladvertisements` (
  `ad_id` int(11) NOT NULL AUTO_INCREMENT,
  `post_id` int(11) NOT NULL,
  `stripe_id` varchar(40) COLLATE utf8mb4_unicode_ci NOT NULL,
  `daily_budget` float NOT NULL,
  `start_date` timestamp NOT NULL DEFAULT current_timestamp(),
  `end_date` timestamp NOT NULL DEFAULT current_timestamp(),
  `status` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending',
  PRIMARY KEY (`ad_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `tblchatmembers`
--

DROP TABLE IF EXISTS `tblchatmembers`;
CREATE TABLE IF NOT EXISTS `tblchatmembers` (
  `chatroom_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Gegevens worden geëxporteerd voor tabel `tblchatmembers`
--

INSERT INTO `tblchatmembers` (`chatroom_id`, `user_id`) VALUES
(8, 12),
(8, 4),
(9, 23),
(9, 4),
(10, 12),
(10, 7),
(11, 12),
(11, 24),
(12, 12),
(12, 25),
(13, 12),
(13, 26);

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `tblchatrooms`
--

DROP TABLE IF EXISTS `tblchatrooms`;
CREATE TABLE IF NOT EXISTS `tblchatrooms` (
  `chatroom_id` int(11) NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`chatroom_id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4;

--
-- Gegevens worden geëxporteerd voor tabel `tblchatrooms`
--

INSERT INTO `tblchatrooms` (`chatroom_id`) VALUES
(6),
(7),
(8),
(9),
(10),
(11),
(12),
(13);

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `tblcomments`
--

DROP TABLE IF EXISTS `tblcomments`;
CREATE TABLE IF NOT EXISTS `tblcomments` (
  `comment_id` int(11) NOT NULL AUTO_INCREMENT,
  `post_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `comment` varchar(250) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`comment_id`)
) ENGINE=MyISAM AUTO_INCREMENT=150 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `tblfollowers`
--

DROP TABLE IF EXISTS `tblfollowers`;
CREATE TABLE IF NOT EXISTS `tblfollowers` (
  `user_id` int(11) NOT NULL,
  `follower` int(11) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Gegevens worden geëxporteerd voor tabel `tblfollowers`
--

INSERT INTO `tblfollowers` (`user_id`, `follower`) VALUES
(4, 8),
(4, 12),
(12, 14),
(8, 4),
(16, 12),
(12, 16),
(12, 4),
(15, 20),
(4, 23),
(24, 12),
(12, 24),
(25, 12),
(26, 12),
(12, 26);

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `tbllikes`
--

DROP TABLE IF EXISTS `tbllikes`;
CREATE TABLE IF NOT EXISTS `tbllikes` (
  `post_id` int(11) NOT NULL,
  `liker` int(11) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Gegevens worden geëxporteerd voor tabel `tbllikes`
--

INSERT INTO `tbllikes` (`post_id`, `liker`) VALUES
(1, 1),
(2, 1),
(2, 2),
(2, 3),
(1, 3),
(3, 8),
(4, 4),
(6, 23),
(3, 23),
(7, 23),
(4, 12),
(3, 12),
(6, 12),
(2, 4),
(2, 12),
(9, 24),
(10, 24),
(1, 4),
(6, 4),
(9, 4);

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `tblposts`
--

DROP TABLE IF EXISTS `tblposts`;
CREATE TABLE IF NOT EXISTS `tblposts` (
  `post_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `media_link` varchar(160) NOT NULL,
  `caption` varchar(100) DEFAULT NULL,
  `time_placed` timestamp NOT NULL DEFAULT current_timestamp(),
  `ranking` int(11) NOT NULL DEFAULT 0,
  PRIMARY KEY (`post_id`)
) ENGINE=MyISAM AUTO_INCREMENT=11 DEFAULT CHARSET=latin1;

--
-- Gegevens worden geëxporteerd voor tabel `tblposts`
--

INSERT INTO `tblposts` (`post_id`, `user_id`, `media_link`, `caption`, `time_placed`, `ranking`) VALUES
(1, 1, '83921b7ac04e4418df5577db5b4c4097541100e4d46933c6a3254a4ca66e43de.jpg', 'Mijn achtergrond', '2022-09-06 08:42:09', 0),
(3, 4, 'b4f6b822d855c0ff2df352b54b7be43a7b34db2eb390c22760c71c987cead3f6.jpg', 'oh dream', '2022-09-08 13:06:19', 0),
(6, 4, 'dfc2589ed3e13b0e30e423c3df732cf6c5d1dad7dd352ab3543ebf3eb57555be.jfif', 'This me :)', '2022-10-04 09:09:40', 0),
(9, 12, '534d02df42343e66018cd911ab4a79f6a74131e36a9a50663b0bab74fc96027f.jpg', '', '2022-11-22 10:20:34', 0);

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `tblusers`
--

DROP TABLE IF EXISTS `tblusers`;
CREATE TABLE IF NOT EXISTS `tblusers` (
  `user_id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(32) NOT NULL,
  `email` varchar(80) NOT NULL,
  `password` varchar(64) NOT NULL,
  `bio` varchar(250) DEFAULT NULL,
  `profile_image` varchar(200) DEFAULT 'StandardUserImage.jpg',
  `verified` tinyint(4) NOT NULL DEFAULT 0,
  `visible` tinyint(4) NOT NULL DEFAULT 1,
  `visible_code` int(11) DEFAULT NULL,
  `role` varchar(5) NOT NULL DEFAULT 'user',
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`)
) ENGINE=MyISAM AUTO_INCREMENT=28 DEFAULT CHARSET=latin1;

--
-- Gegevens worden geëxporteerd voor tabel `tblusers`
--

INSERT INTO `tblusers` (`user_id`, `username`, `email`, `password`, `bio`, `profile_image`, `verified`, `visible`, `visible_code`, `role`) VALUES
(4, '@dream', 'azueiozauoei@bazandpoort.be', '09740553c7e587dda473221bf0f4b67f230b22a6db25c3f9b1fec1cc7ef3d5a7', 'I like dream', 'f5fa76db1367f320cfed892b7b8ff89e92ddcb189c3237e3825009a6f043f4f2.jpg', 0, 1, NULL, 'user'),
(3, '@root', 'jitsetambuyzer@gmail.com', '09740553c7e587dda473221bf0f4b67f230b22a6db25c3f9b1fec1cc7ef3d5a7', 'mag ik u spletvulkaan laten uitbarsten?', 'StandardUserImage.jpg', 0, 1, NULL, 'user'),
(5, '@minecraft', 'ezihaoe@gmail.com', '812ceef7fef54c4e1a7f93c9bb7fb3b059cd3011c0c14dedf0ade412497216c9', NULL, 'StandardUserImage.jpg', 0, 1, NULL, 'user'),
(6, '@sova', 'e@gmail.com', 'e057d9ed6b08c95b376e8a3b8f613783eb70bf79e89e216963a5fea785646aea', NULL, 'StandardUserImage.jpg', 0, 1, NULL, 'user'),
(12, '@admin', 'warre.bossaert@bazandpoort.be', '09740553c7e587dda473221bf0f4b67f230b22a6db25c3f9b1fec1cc7ef3d5a7', 'bio', '4cef7289b483f1f3a4aaca774b8c8cbfcfe8a2b834ec5d051573e2f9516857a5.jpg', 0, 1, NULL, 'admin'),
(16, '@beyou', 'warre.bossaert+beyou@bazandpoort.be', '09740553c7e587dda473221bf0f4b67f230b22a6db25c3f9b1fec1cc7ef3d5a7', NULL, 'StandardUserImage.jpg', 0, 1, NULL, 'user'),
(17, '@creators', 'warre.bossaert+creators@bazandpoort.be', '09740553c7e587dda473221bf0f4b67f230b22a6db25c3f9b1fec1cc7ef3d5a7', NULL, 'StandardUserImage.jpg', 0, 1, NULL, 'user'),
(27, '@warre', 'warre.bossaer+1trh@bazandpoort.be', '09740553c7e587dda473221bf0f4b67f230b22a6db25c3f9b1fec1cc7ef3d5a7', NULL, 'StandardUserImage.jpg', 0, 1, NULL, 'user'),
(25, '@thibeau', 'thibeau.raes@bazandpoort.be', '0ad58a6d2ee54af9a9c1a727a652d914c409fd9cd0211de65e53e1460dee46fa', NULL, 'StandardUserImage.jpg', 0, 1, NULL, 'user'),
(26, '@ditishem', 'okkk@gmail.com', 'b210990f5bdc3821b9edbd926197805caa7f0c1b640f0fd352b5a1b81d57fe58', NULL, 'StandardUserImage.jpg', 0, 1, NULL, 'user');

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `tblviewed`
--

DROP TABLE IF EXISTS `tblviewed`;
CREATE TABLE IF NOT EXISTS `tblviewed` (
  `post_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `view_date` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Gegevens worden geëxporteerd voor tabel `tblviewed`
--

INSERT INTO `tblviewed` (`post_id`, `user_id`, `view_date`) VALUES
(1, 1, '2022-09-06 08:42:09'),
(1, 1, '2022-09-06 08:42:09'),
(1, 2, '2022-09-06 08:50:56'),
(2, 1, '2022-09-06 08:55:13'),
(2, 2, '2022-09-06 09:37:43'),
(2, 3, '2022-09-08 12:53:10'),
(1, 3, '2022-09-08 12:53:10'),
(1, 4, '2022-09-08 13:06:08'),
(2, 4, '2022-09-08 13:06:08'),
(3, 2, '2022-09-08 13:14:13'),
(1, 10, '2022-09-09 09:07:07'),
(2, 10, '2022-09-09 09:07:07'),
(2, 10, '2022-09-09 09:07:07'),
(1, 10, '2022-09-09 09:07:07'),
(3, 10, '2022-09-09 09:07:08'),
(3, 8, '2022-09-09 09:07:44'),
(3, 12, '2022-09-09 12:59:47'),
(2, 12, '2022-09-09 13:22:53'),
(1, 12, '2022-09-09 13:22:53'),
(3, 3, '2022-09-09 13:44:46'),
(6, 4, '2022-10-04 09:20:02'),
(3, 4, '2022-10-04 09:21:03'),
(4, 4, '2022-10-04 09:21:03'),
(6, 12, '2022-10-04 09:22:26'),
(6, 23, '2022-10-04 09:33:04'),
(3, 23, '2022-10-04 09:33:17'),
(2, 23, '2022-10-04 09:33:17'),
(1, 23, '2022-10-04 09:33:17'),
(7, 23, '2022-10-04 09:34:30'),
(4, 12, '2022-10-04 10:12:01'),
(7, 12, '2022-10-04 10:14:24'),
(9, 12, '2022-11-22 10:20:35'),
(9, 12, '2022-11-22 10:20:35'),
(10, 12, '2022-11-25 13:05:13'),
(10, 12, '2022-11-25 13:05:13'),
(3, 24, '2023-01-13 10:09:00'),
(2, 24, '2023-01-13 10:09:00'),
(1, 24, '2023-01-13 10:09:27'),
(6, 24, '2023-01-13 10:09:27'),
(4, 24, '2023-01-13 10:09:27'),
(1, 27, '2023-03-06 12:48:37'),
(9, 24, '2023-01-13 10:09:27'),
(10, 24, '2023-01-13 10:10:21'),
(7, 24, '2023-01-13 10:16:17'),
(7, 24, '2023-01-13 10:16:17'),
(10, 4, '2023-01-13 10:34:25'),
(9, 4, '2023-01-13 10:34:25'),
(3, 25, '2023-01-20 12:43:09'),
(2, 25, '2023-01-20 12:43:09'),
(1, 25, '2023-01-20 12:43:11'),
(6, 25, '2023-01-20 12:43:11'),
(3, 27, '2023-03-06 12:48:37'),
(9, 25, '2023-01-20 12:45:22'),
(4, 25, '2023-01-20 12:45:22'),
(4, 25, '2023-01-20 12:45:22'),
(7, 25, '2023-01-20 12:46:10'),
(10, 25, '2023-01-20 12:46:13'),
(3, 26, '2023-01-20 15:16:29'),
(2, 26, '2023-01-20 15:16:29'),
(1, 26, '2023-01-20 15:16:45'),
(6, 26, '2023-01-20 15:16:45'),
(4, 26, '2023-01-20 15:16:47'),
(7, 4, '2023-02-27 15:12:31'),
(9, 26, '2023-01-20 15:16:49'),
(7, 26, '2023-01-20 15:16:49');
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
