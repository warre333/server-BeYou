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

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `tblchatrooms`
--

DROP TABLE IF EXISTS `tblchatrooms`;
CREATE TABLE IF NOT EXISTS `tblchatrooms` (
  `chatroom_id` int(11) NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`chatroom_id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4;

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

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `tbllikes`
--

DROP TABLE IF EXISTS `tbllikes`;
CREATE TABLE IF NOT EXISTS `tbllikes` (
  `post_id` int(11) NOT NULL,
  `liker` int(11) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

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
-- Tabelstructuur voor tabel `tblviewed`
--

DROP TABLE IF EXISTS `tblviewed`;
CREATE TABLE IF NOT EXISTS `tblviewed` (
  `post_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `view_date` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
