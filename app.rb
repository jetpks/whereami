#!/usr/bin/env ruby

require 'sinatra'

error 400 do
  'Bad Request'
end

get '/api/last/:amount' do
  # return last :amount of locations.
  # 0 for all
  # must be non-negative integer
  if(!params[:amount].is_a? Integer or params[:amount] < 0) then
    400
  end
  return getlast(params[:amount]).to_s
end

post '/api/update' do
  # parse lat/long into city,state, then store in the db.

end

def getlast(amount)
  client = Mysql2::Client.new(:host => 'localhost', :username => 'whereami')
  amt = client.escape(amount)
  return client.query("SELECT * FROM `locations` ORDER BY `id` DESC LIMIT #{amt}", :symbolize_keys => true)
end
