from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import create_engine
from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.orm import sessionmaker, scoped_session
from sqlalchemy import ForeignKey
from sqlalchemy.orm import relationship, backref


engine = create_engine("sqlite:///finalProject.db", echo=True)
session = scoped_session(sessionmaker(bind=engine, autocommit=False, autoflush=False))

Base = declarative_base()
# Base.metadata.create_all(engine)

Base.query = session.query_property()

### Class declarations go here
class User(Base):
	__tablename__ = "users"

	id = Column(Integer, primary_key = True)
	email = Column(String(64))
	password = Column(String(64))

	def __repr__(self):
		return "<User id:%d, email:%s, password:%s>" %(self.id, self.email, self.password)


class Route(Base):
	__tablename__ = "routes"

	id = Column(Integer, primary_key = True)
	user_id = Column(Integer, ForeignKey('users.id'))
	name = Column(String(64), nullable = True)
	line_color = Column(String(64))
	elevation = Column(Integer)
	distance = Column(Integer)
	most_direct_distance = Column(Integer)
	left_turns = Column(Integer)
	#standardized values
	s_elevation = Column(Integer)
	s_distance = Column(Integer)
	s_left_turns = Column(Integer)
	

	user = relationship("User",
		backref=backref("routes", order_by=id))

	def __repr__(self):
		return "<Route id:%d, user_id:%s>" %(self.id, user_id.id)




class Waypoint(Base):
	__tablename__ = "waypoints"

	id = Column(Integer, primary_key = True)
	route_id = Column(Integer, ForeignKey('routes.id'))
	point = Column(String(100))

	route = relationship("Route",
		backref=backref("waypoints", order_by=id))

	def __repr__(self):
		return "<id:%d, route_id:%d, point:%d>" %(self.id, self.route_id, self.point)



def get_user(email, p):
	print "email", email
	print "password", p
	user_query = session.query(User).filter(User.email == email).first()

	#if email is in db
	if user_query:
		if user_query.password == p:
			return True
			
		else:
			return False
	else:
		return False


def main():
	pass

if __name__ == "__main__":
    main()		