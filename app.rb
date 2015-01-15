#!/usr/bin/env ruby

require 'rubygems'
require 'yaml'
require 'mysql2'
require 'sinatra'
require 'sinatra/json'

CONFIG = YAML.load_file('./config.yml')
MYSQL  = CONFIG['mysql']

get '/api/mapkey' do
  json { :key => CONFIG['map']['googlekey'] }
end

get '/api/last/:amount' do
  # return last :amount of locations.
  # 0 for all
  # must be non-negative integer
  amount = params[:amount].to_i
  if(amount < 0) then
    badrequest ":amount needs to be 0 or greater!"
  end
  json getlast(amount)
end

post '/api/update' do
  # shove junk into the db.
  # Pretty much just validate
  latitude = params[:latitude].to_f
  longitude = params[:longitude].to_f

  if(latitude.abs > 90 or longitude.abs > 180) then
    badrequest "Invalid longitude or latitude: long(#{longitude}), lat(#{latitude})"
  end
  if(!params[:city].is_a? String or !params[:state].is_a? String or !params[:country].is_a? String) then
    badrequest "city, state, or country is not a string!"
  end
  if(has_badchars?(params[:city]) or has_badchars?(params[:state]) or has_badchars?(params[:country])) then
    badrequest "city, state, or string contains an invalid character!"
  end
  client = lolmysql
  client.query("INSERT INTO `locations` (latitude, longitude, city, state, country, timestamp) VALUES (#{latitude}, #{longitude}, '#{client.escape(params[:city])}', '#{client.escape(params[:state])}', '#{client.escape(params[:country])}', #{Time.now.to_i})")
  'OK'
end

def badrequest(reason="")
  puts "400 was called!"
  halt 400,"Bad Request #{reason}"
end


def getlast(amount)
  limit = String.new
  if(amount > 0) then
    limit = "LIMIT #{amount}"
  end
  ret = Array.new
  client = lolmysql
  client.query("SELECT `timestamp`,`latitude`,`longitude`,`city`,`state`,`country` FROM `locations` ORDER BY `id` DESC #{limit}").each do |row|
    ret.push(row)
  end
  return ret
end

def lolmysql
  Mysql2::Client.new(:host => MYSQL['host'], :username => MYSQL['user'], :password => MYSQL['pass'], :database => MYSQL['db'], :port => MYSQL['port'])
end

def has_badchars?(thingy)
  if thingy.match(/[^a-zA-Z0-9\-_\s]/) then
    return true
  end
  return false
end
