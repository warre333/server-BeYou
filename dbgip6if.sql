-- phpMyAdmin SQL Dump
-- version 5.0.2
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Gegenereerd op: 20 jun 2022 om 09:05
-- Serverversie: 5.7.31
-- PHP-versie: 7.4.9

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
-- Tabelstructuur voor tabel `tblcomments`
--

DROP TABLE IF EXISTS `tblcomments`;
CREATE TABLE IF NOT EXISTS `tblcomments` (
  `comment_id` int(11) NOT NULL AUTO_INCREMENT,
  `post_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `comment` varchar(250) NOT NULL,
  PRIMARY KEY (`comment_id`)
) ENGINE=MyISAM AUTO_INCREMENT=60 DEFAULT CHARSET=latin1;

--
-- Gegevens worden geëxporteerd voor tabel `tblcomments`
--

INSERT INTO `tblcomments` (`comment_id`, `post_id`, `user_id`, `comment`) VALUES
(4, 2, 4, 'Cock'),
(6, 3, 4, 'YOOOOOOOOO THIS DA ROK?'),
(7, 4, 4, 'DA CROC?'),
(8, 2, 4, 'Rock'),
(9, 2, 4, 'Rock'),
(56, 3, 1, 'sex?'),
(51, 3, 4, 'MAAAH MAN');

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
(3, 1),
(2, 1),
(2, 1),
(1, 2),
(3, 4),
(1, 4);

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
(2, 4),
(3, 4),
(4, 4);

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
(1, 1, 'https://wikiimg.tojsiabtv.com/wikipedia/commons/thumb/b/b4/Logan_Rock_Treen_closeup.jpg/1200px-Logan_Rock_Treen_closeup.jpg', 'ROCK', '2022-05-19 11:08:36', 0),
(2, 1, 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/Cock.jpg/640px-Cock.jpg', 'The cock', '2022-05-19 11:08:36', 2),
(3, 3, 'https://upload.wikimedia.org/wikipedia/commons/5/59/Dwayne_Johnson_2018.jpg', 'The Rock 3', '2022-05-19 11:08:36', 2),
(4, 1, 'https://i.pinimg.com/originals/17/1b/c2/171bc2472906699c3dce0501bf2e734c.jpg', 'ROCK', '2022-05-19 15:11:54', 1);

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
  `profile_image` varchar(200) DEFAULT 'None',
  `verified` tinyint(4) NOT NULL DEFAULT '0',
  `visible` tinyint(4) NOT NULL DEFAULT '1',
  `visible_code` int(11) DEFAULT NULL,
  `role` varchar(5) NOT NULL DEFAULT 'user',
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`)
) ENGINE=MyISAM AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;

--
-- Gegevens worden geëxporteerd voor tabel `tblusers`
--

INSERT INTO `tblusers` (`user_id`, `username`, `email`, `password`, `bio`, `profile_image`, `verified`, `visible`, `visible_code`, `role`) VALUES
(1, '@warre002', 'warre.bossaert@gmail.com', '107448d268ebeae2ff265f20adadedfc6c00c81dc3065c6423903a1aa68b8740', 'TEst Bio', 'https://assets.puzzlefactory.pl/puzzle/251/616/original.jpg', 0, 1, 0, 'user'),
(2, '@warre', 'warre.bossaert+test@gmail.com', '107448d268ebeae2ff265f20adadedfc6c00c81dc3065c6423903a1aa68b8740', 'TEst Bio', 'None', 0, 1, 0, 'user'),
(3, '@warre3', 'warre.bossaert+test2@gmail.com', '107448d268ebeae2ff265f20adadedfc6c00c81dc3065c6423903a1aa68b8740', 'TEst Bio', 'None', 0, 1, 0, 'user'),
(4, '@admin', 'warre.bossaert+admin@gmail.com', '107448d268ebeae2ff265f20adadedfc6c00c81dc3065c6423903a1aa68b8740', 'Admin hier van man', 'None', 0, 1, NULL, 'user');

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `tblviewed`
--

DROP TABLE IF EXISTS `tblviewed`;
CREATE TABLE IF NOT EXISTS `tblviewed` (
  `post_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `view_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Gegevens worden geëxporteerd voor tabel `tblviewed`
--

INSERT INTO `tblviewed` (`post_id`, `user_id`, `view_date`) VALUES
(2, 4, '2022-06-08 09:26:58'),
(3, 4, '2022-06-08 09:26:58'),
(3, 4, '2022-06-08 09:26:58'),
(1, 4, '2022-06-08 09:29:11'),
(4, 4, '2022-06-08 09:29:11'),
(1, 4, '2022-06-08 09:29:11');
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
