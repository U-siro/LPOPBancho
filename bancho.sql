-- --------------------------------------------------------
-- 호스트:                          127.0.0.1
-- 서버 버전:                        10.1.10-MariaDB - mariadb.org binary distribution
-- 서버 OS:                        Win64
-- HeidiSQL 버전:                  9.3.0.4984
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;

-- bancho 데이터베이스 구조 내보내기
CREATE DATABASE IF NOT EXISTS `bancho` /*!40100 DEFAULT CHARACTER SET latin1 */;
USE `bancho`;


-- 테이블 bancho.scores 구조 내보내기
CREATE TABLE IF NOT EXISTS `scores` (
  `replayID` int(11) NOT NULL AUTO_INCREMENT,
  `beatmapHash` varchar(32) DEFAULT NULL,
  `userID` varchar(5) DEFAULT NULL,
  `count300` int(11) DEFAULT NULL,
  `count100` int(11) DEFAULT NULL,
  `count50` int(11) DEFAULT NULL,
  `countKatu` int(11) DEFAULT NULL,
  `countGeki` int(11) DEFAULT NULL,
  `countMiss` int(11) DEFAULT NULL,
  `score` int(11) DEFAULT NULL,
  `combo` int(11) DEFAULT NULL,
  `fc` tinyint(1) DEFAULT NULL,
  `mods` int(11) DEFAULT NULL,
  `time` varchar(18) DEFAULT NULL,
  `mode` tinyint(4) DEFAULT NULL,
  `completed` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`ID`),
  UNIQUE KEY `ID` (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- 내보낼 데이터가 선택되어 있지 않습니다.


-- 테이블 bancho.users 구조 내보내기
CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `passwordHash` varchar(50) NOT NULL,
  `isBanned` int(1) DEFAULT NULL,
  `isAdmin` int(1) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- 내보낼 데이터가 선택되어 있지 않습니다.
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
