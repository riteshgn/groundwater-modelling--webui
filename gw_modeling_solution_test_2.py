# -*- coding: utf-8 -*-
"""
Created on Tue Jun  5 20:52:30 2018

@author: Chris
"""

# -*- coding: utf-8 -*-
"""
Created on Fri May  4 11:28:26 2018

@author: Chris
"""
#%%

#some ideas from from Vincent Post http://python.hydrology-amsterdam.nl/manuals/computer_labs_post.pdf
#others from MODFLOW 2005 user manual
#others from Mary's book



import numpy as np
#from numpy import array
import matplotlib.pyplot as plt
import time

plt.close('all')

#%% functions

# function to create an array from a 3 lists. The 3 lists describe the i & j location and the head of all constant head cells.
# The resulting array has a value in all constant head (CHD) cells and a NaN in all cells for which head will be modeled.
def make_chd(chd_i,chd_j,chd_h,sizer): #sizer is size of the model domain (mxn)
    hinit=np.zeros(sizer)*np.nan #hinit is the initial head array
    for i in range(0,len(chd_i)): # loop through all i,j,h values in the three lists and assign them to the array
        hinit[chd_j[i],chd_i[i]]=chd_h[i]
    return hinit

# function to create an array from a 3 lists. The 3 lists describe the i & j location and the pumping rate of all well cells.
# The resulting array has a non-zero value in all cells where pumping occurs and a zero value where no pumping takes place.
def make_wells(well_i,well_j,well_Q,sizer): #sizer is size of the model domain (mxn)
    Q=np.zeros(sizer) #initialize array
    for i in range(0,len(well_i)): #loop through three lists and asssign values to well array (Q)
        Q[np.int(well_j[i]),np.int(well_i[i])]=well_Q[i]
    wellterm=Q
    return wellterm

# function to assign recharge to model cells. Recharge in each cell is the sum of recharge rate (length/time) and the area of the top of the cell.
# The area of the top of the cell depends on the orientation of the model.
#recharge is prescribed to all cells if the model is map view, but only row one (the top cells) if the model is cross sectional
def make_rch(rch_rate,cross_section_bool,sizer,cellarea): #sizer is size of the model domain (mxn), cell area is area of each cell on the recharge face
    R=np.zeros(sizer) #initialize array
    if cross_section_bool: #if the model is cross sectional (a vertical slice)
        #top row (row=0) is assigned recharge rate
        for col in range(0,sizer[1]): #assign recharge rate to only cells in row 1
            R[0,col]=rch_rate
    else:  #otherwise, it's map view, so all cells assigned recharge rate
        R=np.ones(sizer)*rch_rate
    R=R*cellarea #multiply rate by area of cell over which recharge is applied
    return R

#create an ibound array, which describes the type of boundary in each cell
#the boundary types are as follows: 1 well pumping, -1 constant head, 0 simulated (calculate heads)    
def make_ibound(hinit,wellterm): 
    sizer=np.shape(hinit) #size of the model
    ibound=np.ones(sizer) #initialize array -- all cells simulated (=0) unless otherwise assigned
    for row in range(0,nrow): #loop through rows
        for col in range(0,ncol): #loop through columns
            if wellterm[row,col]!=0:    #if theres a well in the cell, set ibound value =1
                ibound[row,col]=1
            if ~np.isnan(hinit[row,col]): #if cell is constant heas, set ibound value =-1
                ibound[row,col]=-1
    return ibound

#groundwater solver
def solve_GW_SOR(conv_crit,SOR,maxLoops,ibound,hinit,wellterm,rchterm,delx,dely,delz,cross_section_bool,K):
    #conv_crit = max error value acceptable for convergence
    #SOR = successive over relaxation value 1<SOR<2
    #maxloops = stop model after this many iterations to prevent limitless runs
    #ibound described the boundary type of each cell
    #hinit is the initial head values of the model
    #wellterm is the array decribing pumping rates in different cells
    #rchterm shows cells in which recharge occurs
    #delx, dely, delz are the x(col), y(row) and z(depth into page) dimensions of each model cell; Z is also total model thickness, because model is always 1 cell in z direction
    #cross_section_bool is boolean False = map view, True = cross-sectional view
    #K = array describing hydraulic conductivity field in the model
    
    #initialize
    t = time.time() #time at start of solver
    converged=False #loop until converged, initialize
    ni=0 #outer iteration number initialize
    hinit_mean=np.nanmean(hinit)
    h=np.copy(hinit)
    max_err=np.zeros(maxLoops+4) #list to store error at each iteration
    
    for row in range(0,nrow):#assign the average prescribed constant head value to all cells to speed up convergence
        for col in range(0,ncol):
            if np.isnan(h[row,col]):
                h[row,col]=hinit_mean
    
    #loop until either converged or maxLoops is reached
    while(not converged):
        #initialize outer loop
        for row in range(0,nrow): #outer loop - loop through iterations
            for col in range(0,ncol): #inner loop - loop through cells within a single iteration
                h_old=h[row,col] #before solving for new h, store old h
                #initialize inner loop
                Csum=a=b=c=d=q=0 #clear/initialize looping values
                if cross_section_bool==True: #if it's a cross section
                    satd=1 #the cells are fully saturated
                else:
                    satd=h[row,col]/delz #if it's in map view, use boussinesq assumption that water only flows through saturated thickness of cell
                    #thereby reducing effective K
                    #to make this work for mapview unconfined aquifers, multiply the delz term by %sat (satd)
                    #where %sat is head(m-1)/delz. In other words, because the cell is not filled with water, 
                    #water only flows through part of it, so K & fluxes are reduced
                if ibound[row,col]>0: # if the cell is not a constant head cell, then solve for head. If it is a constant head cell, then head needn't be solved for
                    if row>0:  #flow from above VV (no flow from above in row 0)
                        #calculate conductance value between each neighboring cell (u,d,l,r)
                        #thisC = conductance value = Area*Kmean between 2 cells/dl
                        thisC=satd*delz*delx*(K[row,col]+K[row-1,col])/2/dely
                        a=thisC*h[row-1,col] #a_term is conductance times head to the left
                        Csum +=thisC #if there is a cell here, add the conductance term to the denominator_sum_term
                        
                    if row<nrow-1: #flow from below ^^ (no flow from above in last row)
                        thisC=satd*delz*delx*(K[row,col]+K[row+1,col])/2/dely
                        b=thisC*h[row+1,col]
                        Csum +=thisC
                        
                    if col>0: #flow from left ==>> (no flow from left in col 0)
                        thisC=satd*delz*dely*(K[row,col]+K[row,col-1])/2/delx
                        c=thisC*h[row,col-1]
                        Csum +=thisC
                        
                    if col<ncol-1: #flow from right <<== (no flow from right in last col)
                        thisC=satd*delz*dely*(K[row,col]+K[row,col+1])/2/delx
                        d=thisC*h[row,col+1]
                        Csum+=thisC
                        
                    if (rchterm[row,col]+wellterm[row,col])!=0: #if either recharge term or wellterm have a volumetric flux entering/leaving domain
                        q=wellterm[row,col]+rchterm[row,col]  # assign a value to q
                if Csum!=0: #if conductance was calculated between this cell and at least one neightboring cell
                    #calculate a new head for the cell based on the previous head and the conductances/heads of neighboring cells
                    #h[row,col]=(a+b+c+d+q)/Csum #no SOR - Gauss Seidel method                    
                    h[row,col]=(1-SOR)*h[row,col]+SOR*(a+b+c+d+q)/Csum #Use successive over relaxation (SOR) --  speed convergence with h from last iteration 

                if cross_section_bool == False: #in a cross-sectional model, h must be >0 and <cell thickness
                    if h[row,col]<0: #head is below bottom of model domain, don't let that happen!
                        h[row,col]=0 
                    if h[row,col]>delz: #head is above top of model domain, don't let that happen!
                        h[row,col]=delz
                
                diff=h[row,col]-h_old #calculate difference between the old h value and this new one
                if diff>max_err[ni]: #if this difference is the biggest head difference in this iteration, store it.
                    max_err[ni]=diff #store in list

        if max_err[ni]<conv_crit: #if all inner iterations changes are smaller than conv_crit, then the model is converged. Move on>finish up>plot
            converged=True
        if ni>maxLoops: #if we've exceeded the max number of loops, return error and crash. We don't want to bore everyone watching this go infinitely
            converged=True
            print('maximum loops exceeded!')
        ni+=1 #increment counter to track number of iterations
    
    #print final solver stats
    print(['loopNum = ', ni])
    print((ni,max_err[ni]))  
    print([np.str(time.time() - t),' seconds elapsed'])

    #initialize arrays to store flow in x and y directions (qx and qy)
    qx=np.zeros(np.shape(h))
    qy=np.zeros(np.shape(h))
    for row in np.arange(1,nrow):
        for col in np.arange(1,ncol):
            qx[row,col]=(K[row,col]+K[row,col])/2*(h[row,col]-h[row,col-1])/delx #calculate Darcy Velocity, q, (m/s) in the x direction with Darcy's Law (q=K*dh/dl)
            qy[row,col]=(K[row,col]+K[row,col])/2*(h[row,col]-h[row-1,col])/dely #and the y direction

    plt.figure() #plot error versus iteration
    plt.plot(np.arange(0,ni),max_err[0:ni])
    plt.xlabel('timestep #')
    plt.ylabel('max error (L)')
    plt.yscale('log')
    
    return h, ni, qx, qy

#%% end functions

#%% Initialize

delx=10 #x-thickness of cell
dely=10 #y-thickness of cell
unitThickness=100 #defines delz if it's mapView, delz is 1 in cross-section 

ncol=50 #number of columns in mode
nrow=50 #number of rows in columns
sizer=[nrow,ncol] #duplet size of model domain

conv_crit=1e-3 #maximum change between heads in the same cell in neighboring outer iterations must be less than this
SOR=1.75 #relaxation factor 1=Gauss-Seidel, 1-2 = SOR, < 1=under-relaxed
maxLoops=1000 #maximum number of outer iterations

rch_rate=.3/365 #m/d - recharge volume/day

cross_section_bool=False #cross sectional or map view
if cross_section_bool: #it's cross sectional model
    cellarea=delx*1 #model domain is only 1 unit into page in cross section
    delz=1 #depth into page is one unit width
else: #it's map view
    cellarea=delx*dely #each model cell top has an area of row x col in map view
    delz=unitThickness #thickness into page = aquifer thickness
    
#initialize K values
# assign reasonalble hydrualic condcutivities to gravel et al.,
Kgravel=float(10)**3#m/d #  '**' means "^"
Ksand=float(10)**1#m/d
Ksilt=float(10)**-1#m/d
Kclay=float(10)**-4#m/d

randomKbool=True #should we generate a random K?
connectivity_x=1 #smoothing in x direction of random K field
connectivity_y=1 #smoothing in x direction of random K field

aquitard=-1  #>=0 there is an aquitard at row # (negative value means no aquitard), if we want to add a single clay layer in part of the domain
aquitardThick=3 # aquitard thickness


#%% generate K field
if randomKbool: #if we're generating a radom K field
    K=np.ceil(np.random.rand(sizer[0],sizer[1])*4) #randomly assign int value of 1-4 to an array the size of the model domain
    K[K==1]=Kgravel #assign gravel to all cells with #1
    K[K==2]=Ksand #same
    K[K==3]=Ksilt #same
    K[K==4]=Kclay #same
    import scipy.ndimage as sp #import scipy for gaussian filter
    #smooth the Kfield with gaussian filter
    K = sp.filters.gaussian_filter(K, [connectivity_y,connectivity_x], mode='constant')
    #restretch following the smoothing to have values range from 10e-4 through 10e3
    K=np.power(10,(np.log10(K)-np.log10(np.min(K)))*(np.log10(Kgravel)-np.log10(Kclay))/(np.log10(np.max(K))-np.log10(np.min(K)))+np.log10(Kclay))
else: #if we're not generating a random K field, assign a value of sand to all cells in domain
    K=np.ones(sizer)*Ksand



if aquitard+aquitardThick>nrow: #if this would draw an aquitard out of bounds, don't do it!
    aquitard=-1
    print('Aquitard out of bounds -- turned off')
if aquitard>=0: #if we are drawing an aquitard, add 'aquitardThick' rows of clay to domain starting at row 'aquitard'
    K[aquitard:aquitard+aquitardThick,:]=Kclay


#%% Scenario 1
#chd_i=np.array([0,0,49,1,9,6,49])
#chd_j=np.array([0,49,0,9,1,5,49])
#chd_h=np.array([4,5,6,7,-5,5,3])

#well_i=np.array([24,35,15,35])
#well_j=np.array([24,15,40,45])
#well_Q=np.array([10000,-50000,15000,-9000]) #pos=into cell; neg=out of cell

#%% Scenario 2

#chd_i=np.array([0,0,49,49])
#chd_j=np.array([0,49,0,49])
#chd_h=np.array([1,10,1,10])

#well_i=np.array([15,35])
#well_j=np.array([10,40])
#well_Q=np.array([10000,-10000]) #pos=into cell; neg=out of cell

#%% Scenario 3 - river example
chd_i=np.concatenate((np.arange(0,26),25*np.ones(3),np.arange(25,50)))
chd_j=np.concatenate((10*np.ones(26),np.arange(11,14),14*np.ones(25)))
chd_j=chd_j.astype('int')
chd_i=chd_i.astype('int')
chd_h=np.arange(50,20,-30/54)
hinit=make_chd(chd_i,chd_j,chd_h,sizer)

well_i=np.array([10])
well_j=np.array([40])
well_Q=np.array([-10000]) #pos=into cell; neg=out of cell

plt.figure()
plt.plot(chd_i,chd_j,'o-b')

#%% Build input arrays

hinit=make_chd(chd_i,chd_j,chd_h,sizer)
wellterm=make_wells(well_i,well_j,well_Q,sizer)
rchterm=make_rch(rch_rate,cross_section_bool,sizer,cellarea)
ibound=make_ibound(hinit,wellterm)

#%% SOLVE for head and flow
h,ni,qx,qy=solve_GW_SOR(conv_crit,SOR,maxLoops,ibound,hinit,wellterm,rchterm,delx,dely,delz,cross_section_bool,K)

#%% PLOT results

#plt.close('all')
x=np.arange(0,delx*ncol+delx,delx)
y=np.arange(0,dely*nrow+dely,dely)
xi,yi=np.meshgrid(x,y)

plt.figure()

plt.subplot(2,3,1)
plt.pcolor(x,y, hinit)
plt.gca().invert_yaxis()
plt.colorbar()
plt.title('initial head')

plt.subplot(2,3,2)
plt.pcolor(x,y,ibound)
plt.gca().invert_yaxis()
plt.colorbar()
plt.plot(delx*(well_i+.5),well_j*dely+dely/2,'+r')
plt.plot(chd_i*delx+delx/2,chd_j*dely+dely/2,'sb',markerfacecolor='none')
plt.title('ibound')
plt.legend(('well','chd'))

plt.subplot(2,3,3)
plt.pcolor(x,y,np.log10(K))
plt.colorbar()
plt.title('K-field')
plt.plot(delx*(well_i+.5),well_j*dely+dely/2,'+r')
plt.plot(chd_i*delx+delx/2,chd_j*dely+dely/2,'sb',markerfacecolor='none')
plt.gca().invert_yaxis()
plt.clim(np.log10(Kclay),np.log10(Kgravel))

plt.subplot(2,2,3)
plt.pcolor(xi,yi,h)
plt.colorbar()
plt.plot(well_i*delx+delx/2,well_j*dely+dely/2,'+r')
plt.plot(chd_i*delx+delx/2,chd_j*dely+dely/2,'sb',markerfacecolor='none')
#plt.quiver(np.linspace(delx/2,delx*ncol,delx),np.linspace(dely/2,dely*nrow,dely),qx,qy) #can't get this working...
#plt.quiver(xi,yi,qx,qy) #can't get this working...
plt.title('end head')
plt.gca().invert_yaxis()

plt.subplot(2,2,4)
plt.contourf(h,15)
plt.colorbar()
plt.quiver(-qx,qy)#,np.sqrt(np.square(qx)+np.square(qy)),units='xy')
plt.plot(well_i,well_j,'+r')
plt.plot(chd_i,chd_j,'sb',markerfacecolor='none')
plt.title('heads and flow vectors')
plt.gca().invert_yaxis()
#%%