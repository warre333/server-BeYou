-- phpMyAdmin SQL Dump
-- version 5.0.2
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Gegenereerd op: 19 mei 2022 om 17:04
-- Serverversie: 5.7.31
-- PHP-versie: 7.3.21

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
CREATE DATABASE IF NOT EXISTS `dbgip6if` DEFAULT CHARACTER SET latin1 COLLATE latin1_swedish_ci;
USE `dbgip6if`;

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `tblcomments`
--

DROP TABLE IF EXISTS `tblcomments`;
CREATE TABLE IF NOT EXISTS `tblcomments` (
  `post_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `comment` varchar(250) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

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
(1, 2);

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
  `time_placed` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `ranking` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`post_id`)
) ENGINE=MyISAM AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;

--
-- Gegevens worden geëxporteerd voor tabel `tblposts`
--

INSERT INTO `tblposts` (`post_id`, `user_id`, `media_link`, `caption`, `time_placed`, `ranking`) VALUES
(1, 1, 'https://upload.wikimedia.org/wikipedia/commons/5/59/Dwayne_Johnson_2018.jpg', 'ROCK', '2022-05-19 11:08:36', 0),
(2, 1, 'https://upload.wikimedia.org/wikipedia/commons/5/59/Dwayne_Johnson_2018.jpg', 'The Rock 2', '2022-05-19 11:08:36', 1),
(3, 3, 'https://upload.wikimedia.org/wikipedia/commons/5/59/Dwayne_Johnson_2018.jpg', 'The Rock 3', '2022-05-19 11:08:36', 1),
(4, 1, 'https://upload.wikimedia.org/wikipedia/commons/5/59/Dwayne_Johnson_2018.jpg', 'ROCK', '2022-05-19 15:11:54', 0);

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `tblusers`
--

DROP TABLE IF EXISTS `tblusers`;
CREATE TABLE IF NOT EXISTS `tblusers` (
  `user_id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(60) NOT NULL,
  `email` varchar(80) NOT NULL,
  `password` varchar(64) NOT NULL,
  `bio` varchar(250) DEFAULT NULL,
  `profile_image` varchar(200) DEFAULT NULL,
  `verified` tinyint(4) NOT NULL DEFAULT '0',
  `visible` tinyint(4) NOT NULL DEFAULT '1',
  `visible_code` int(11) NOT NULL,
  `role` varchar(5) NOT NULL DEFAULT 'user',
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`)
) ENGINE=MyISAM AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;

--
-- Gegevens worden geëxporteerd voor tabel `tblusers`
--

INSERT INTO `tblusers` (`user_id`, `username`, `email`, `password`, `bio`, `profile_image`, `verified`, `visible`, `visible_code`, `role`) VALUES
(1, '@warre002', 'warre.bossaert@gmail.com', '.', 'TEst Bio', '////', 0, 1, 0, 'user'),
(2, '@warre', 'warre.bossaert+test@gmail.com', '.', 'TEst Bio', '////', 0, 1, 0, 'user'),
(3, '@warre3', 'warre.bossaert+test2@gmail.com', '.', 'TEst Bio', '////', 0, 1, 0, 'user');

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `tblviewed`
--

DROP TABLE IF EXISTS `tblviewed`;
CREATE TABLE IF NOT EXISTS `tblviewed` (
  `post_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `view_date` date NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
