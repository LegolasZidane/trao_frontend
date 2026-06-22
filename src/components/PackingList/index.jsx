import React, { Component } from "react";

class PackingList extends Component {
  render() {
    const { trip } = this.props;

    if (!trip) {
      return (
        <div>
          <h2>Packing List</h2>
          <p>Select a trip to view packing list.</p>
        </div>
      );
    }

    const groupedItems = {
      Documents: [],
      Clothing: [],
      Gear: [],
      Other: [],
    };

    trip.packingList.forEach((item) => {
      if (groupedItems[item.category]) {
        groupedItems[item.category].push(item);
      } else {
        groupedItems.Other.push(item);
      }
    });

    return (
      <div>
        <h2>Packing List</h2>

        {trip.packingList.length === 0 ? (
          <p>No packing items available.</p>
        ) : (
          Object.entries(groupedItems).map(
            ([category, items]) =>
              items.length > 0 && (
                <div key={category}>
                  <h3>{category}</h3>

                  <ul>
                    {items.map((item, index) => (
                      <li key={item._id || index}>
                        <input
                          type="checkbox"
                          checked={item.isPacked}
                          readOnly
                        />{" "}
                        {item.item}
                      </li>
                    ))}
                  </ul>
                </div>
              ),
          )
        )}
      </div>
    );
  }
}

export default PackingList;
