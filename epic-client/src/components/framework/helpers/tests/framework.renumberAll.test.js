import React from 'react';
import { renumberAll } from '../framework';

describe('framework renumberAll tests', () => {
   it('sets a singe instance array to 10', () => {
       const startArray = [
           {
               id: 2,
               name: 'Wheelset',
               placing: 1
           }
       ];

       const endArray = renumberAll(startArray);
       expect(endArray.length).toBe(1);
       expect(endArray[0].id).toBe(startArray[0].id);
       expect(endArray[0].placing).toBe(10);
   });
   it('sets multiple instance array to jumps of 10', () => {
       const startArray = [
           {
               id: 2,
               name: 'Wheelset',
               placing: 1
           },
             {
               id: 24,
               name: 'id 24',
               placing: 4
           },
           {
               id: 3,
               name: 'Frameset',
               placing: 1
           }
       ];

       const endArray = renumberAll(startArray);
       expect(endArray.length).toBe(startArray.length);
       expect(endArray[0].id).toBe(startArray[0].id);
       expect(endArray[1].id).toBe(startArray[1].id);
       expect(endArray[2].id).toBe(startArray[2].id);
       expect(endArray[0].placing).toBe(10);
       expect(endArray[1].placing).toBe(20);
       expect(endArray[2].placing).toBe(30);
   });
   it('sets partType instance array to jumps of 10', () => {
       const startArray = [
           {
               id: 2,
               name: 'Wheelset',
               placing: 1
           },
             {
               id: 24,
               name: 'id 24',
               placing: 4,
                 partTypes: [
                     {id: 1,
                         name: 'Frame',
                         description: null,
                         placing: 1,}
                 ]
           },
           {
               id: 3,
               name: 'Frameset',
               partTypes: [
                   {id: 1,
                       attributes: [
                       ],
                       name: 'Frame',
                       description: null,
                       placing: 1,},
                   {id: 2,
                       attributes: [
                           {
                               id: 12,
                               attribute_name: 'Size',
                               in_use: true,
                               mandatory: true,
                               placing: 1,
                               attribute_type: '1',
                               partType: 1
                           },
                           {
                               id: 21,
                               attribute_name: 'Size',
                               in_use: true,
                               mandatory: true,
                               placing: 1,
                               attribute_type: '1',
                               partType: 1
                           },
                           {
                               id: 31,
                               attribute_name: 'Size',
                               in_use: true,
                               mandatory: true,
                               placing: 1,
                               attribute_type: '1',
                               partType: 1
                           }
                       ],
                       name: 'Frame',
                       description: null,
                       placing: 1,},
                   {id: 3,
                       attributes: [
                           {
                               id: 1,
                               attribute_name: 'Size',
                               in_use: true,
                               mandatory: true,
                               placing: 1,
                               attribute_type: '1',
                               partType: 1
                           }
                       ],
                       name: 'Frame',
                       description: null,
                       placing: 1,}
               ],
               placing: 1
           }
       ];

       const endArray = renumberAll(startArray);
       expect(endArray.length).toBe(startArray.length);
       expect(endArray[0].id).toBe(startArray[0].id);
       expect(endArray[1].id).toBe(startArray[1].id);
       expect(endArray[2].id).toBe(startArray[2].id);
       expect(endArray[0].placing).toBe(10);
       expect(endArray[1].placing).toBe(20);
       expect(endArray[2].placing).toBe(30);
       expect(endArray[0].partTypes.length).toBe(0);
       expect(endArray[1].partTypes.length).toBe(startArray[1].partTypes.length);
       expect(endArray[1].partTypes[0].placing).toBe(10);
       expect(endArray[2].partTypes.length).toBe(startArray[2].partTypes.length);
       expect(endArray[1].partTypes[0].attributes.length).toBe(0);
       expect(endArray[2].partTypes[0].attributes.length).toBe(0);
       expect(endArray[2].partTypes[1].attributes.length).toBe(startArray[2].partTypes[1].attributes.length);
       expect(endArray[2].partTypes[1].attributes[0].id).toBe(startArray[2].partTypes[1].attributes[0].id);
       expect(endArray[2].partTypes[1].attributes[0].placing).toBe(10);
       expect(endArray[2].partTypes[1].attributes[1].placing).toBe(20);
       expect(endArray[2].partTypes[1].attributes[2].placing).toBe(30);
       expect(endArray[2].partTypes[1].attributes[1].id).toBe(startArray[2].partTypes[1].attributes[1].id);
       expect(endArray[2].partTypes[1].attributes[2].id).toBe(startArray[2].partTypes[1].attributes[2].id);
       expect(endArray[2].partTypes[2].attributes.length).toBe(startArray[2].partTypes[2].attributes.length);
       expect(endArray[2].partTypes[2].attributes[0].id).toBe(startArray[2].partTypes[2].attributes[0].id);
       expect(endArray[2].partTypes[2].attributes[0].placing).toBe(10);

   });
});